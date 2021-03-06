import React, { Component } from 'react';
import InputComponent from '../InputComponent/InputComponent.js';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import ExceptionHandler from './../../utils/ExceptionHandler';

export class AuthorForm extends Component {
	constructor() {
		super();
		this.enviaForm = this.enviaForm.bind(this);
		this.setInput = this.setInput.bind(this);
		this.state = {
			nome: '',
			senha: '',
			email: ''
		};
	}

	enviaForm(event) {
		event.preventDefault();

		$.ajax({
			url: 'http://cdc-react.herokuapp.com/api/autores',
			contentType: 'application/json',
			dataType: 'json',
			type: 'POST',
			data: JSON.stringify({
				nome: this.state.nome,
				email: this.state.email,
				senha: this.state.senha
			}),
			success: payload => {
                PubSub.publish('update-author-list', (payload.reverse()));
                this.setState({
                    nome: '',
                    email: '',
                    senha: ''
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

    setInput(input, event) {
        this.setState({[input]: event.target.value});
    }
    
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputComponent label="Nome" 
                        id="nome" type="text" name="nome" 
                        value={this.state.nome} 
                        onChange={this.setInput(this, 'nome')} />
                        
                    <InputComponent label="E-mail" 
                        id="email" type="email" name="email" 
                        value={this.state.email} 
                        onChange={this.setInput(this, 'email')} />
                        
                    <InputComponent label="Senha" 
                        id="senha" type="password" name="senha" 
                        value={this.state.senha} 
                        onChange={this.setInput(this, 'senha')} />
                        
                    <div className="pure-control-group">                                  
                        <label></label> 
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                    </div>
                </form>             
            </div>  
        );
    }
}

export class AuthorTable extends Component {   
    render() {
        return (
            <div>            
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.list.map(autor => {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
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

export default class AuthorBox extends Component {
    constructor() {
        super();
		this.state = {
			lista: []
		};
	}

	componentDidMount() {
		$.ajax({
			url:"http://cdc-react.herokuapp.com/api/autores",
			success: retorno => {
				this.setState({
					lista: retorno.reverse()
				});
			}
        });
        
        PubSub.subscribe('update-author-list', (topico, lista) => this.setState({lista}));
    }

    updateList(list) {
        this.setState({lista: list.reverse()});
    }

    render() {
        return (
            <div className="main">
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>

                <div className="content" id="content">
                    <AuthorForm/>
                    <AuthorTable list={this.state.lista} />
                </div>
            </div>
        );
    }
} 