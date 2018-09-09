import React, { Component } from 'react';
import InputComponent from '../InputComponent/InputComponent.js';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import ExceptionHandler from '../../utils/ExceptionHandler.js';

export class BookForm extends Component {
	constructor() {
		super();
		this.enviaForm = this.enviaForm.bind(this);
		this.setTitulo = this.setTitulo.bind(this);
		this.setPreco = this.setPreco.bind(this);
		this.setAutorId = this.setAutorId.bind(this);
		this.state = {
			titulo: '',
			preco: '',
			autorId: ''
		};
	}

	enviaForm(event) {
		event.preventDefault();

		$.ajax({
			url: 'http://cdc-react.herokuapp.com/api/livros',
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify({
				titulo: this.state.titulo,
				preco: this.state.preco,
				autorId: this.state.autorId
			}),
			success: payload => {
                PubSub.publish('update-book-list', (payload.reverse()));
                this.setState({
			titulo: '',
			preco: '',
			autorId: ''
		});
            },
			error: error => {
                if (error.status === 400) {
                    new ExceptionHandler(error.responseJSON);
                }
            },
            beforeSend: () => {
                PubSub.publish('clean-all-errors', {});
            }
		});
	}

	setTitulo(event) {
		this.setState({titulo: event.target.value});
	}

	setPreco(event) {
		this.setState({preco: event.target.value});
	}

	setAutorId(event) {
		this.setState({autorId: event.target.value});
    }
    
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputComponent label="Título" 
                        id="titulo" type="text" name="titulo" 
                        value={this.state.titulo} onChange={this.setTitulo} />
                        
                    <InputComponent label="Preço" 
                        id="preco" type="number" name="preco" 
                        value={this.state.preco} onChange={this.setPreco} />
                    
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.setAutorId}>
                            <option value="">Selecione o Autor</option>
                            {
                                this.props.autores.map(autor => <option  key={autor.id} value={autor.id}>{autor.nome}</option>)
                            }
                        </select>
                    </div>

                    <div className="pure-control-group">                                  
                        <label></label> 
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                    </div>
                </form>             
            </div>  
        );
    }
}

export class BookTable extends Component {   
    render() {
        return (
            <div>            
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.list.map(livro => {
                                return (
                                    <tr key={livro.id}>
                                        <td>{livro.titulo}</td>
                                        <td>{livro.preco}</td>
                                        <td>{livro.autor.nome}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table> 
            </div>             
        );
    }
}

export default class BookBox extends Component {
    constructor() {
        super();
		this.state = {
            lista: [],
            autores: []
		};
	}

	componentDidMount() {
		$.ajax({
			url:"http://cdc-react.herokuapp.com/api/livros",
			success: retorno => {
				this.setState({
					lista: retorno.reverse()
				});
			}
        });

		$.ajax({
			url:"http://cdc-react.herokuapp.com/api/autores",
			success: retorno => {
				this.setState({
					autores: retorno.reverse()
				});
			}
        });
        
        PubSub.subscribe('update-book-list', (topico, lista) => this.setState({lista}));
    }

    updateList(list) {
        this.setState({lista: list.reverse()});
    }

    render() {
        return (
            <div className="main">
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>

                <div className="content" id="content">
                    <BookForm autores={this.state.autores}/>
                    <BookTable list={this.state.lista} />
                </div>
            </div>
        );
    }
} 