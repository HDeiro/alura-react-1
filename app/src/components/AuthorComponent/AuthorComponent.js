import React, { Component } from 'react';
import InputComponent from '../InputComponent/InputComponent.js';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export class AuthorForm extends Component {
	constructor() {
		super();
		this.enviaForm = this.enviaForm.bind(this);
		this.setNome = this.setNome.bind(this);
		this.setEmail = this.setEmail.bind(this);
		this.setSenha = this.setSenha.bind(this);
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
			success: payload => PubSub.publish('update-author-list', (payload.reverse())),
			error: error => console.log(error)
		});
	}

	setNome(event) {
		this.setState({nome: event.target.value});
	}

	setEmail(event) {
		this.setState({email: event.target.value});
	}

	setSenha(event) {
		this.setState({senha: event.target.value});
    }
    
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputComponent label="Nome" 
                        id="nome" type="text" name="nome" 
                        value={this.state.nome} onChange={this.setNome} />
                        
                    <InputComponent label="E-mail" 
                        id="email" type="email" name="email" 
                        value={this.state.email} onChange={this.setEmail} />
                        
                    <InputComponent label="Senha" 
                        id="senha" type="password" name="senha" 
                        value={this.state.senha} onChange={this.setSenha} />
                        
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
            <div className="content" id="content">
                <AuthorForm/>
                <AuthorTable list={this.state.lista} />
            </div>
        );
    }
} 