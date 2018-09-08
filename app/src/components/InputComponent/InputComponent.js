import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class InputComponent extends Component {
    constructor() {
        super();
        this.state = { errorMessage: '' };
    }

    componentWillMount() {
        PubSub.subscribe('clean-all-errors', topic => {
            this.setState({errorMessage: ''});
        });

        PubSub.subscribe('exception-handler', (topic, error) => {
            if (error.errorField.indexOf(this.props.name) > -1) {
                this.setState({
                    errorMessage: error.defaultMessage
                });
            }
        });
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label> 
                <input id={this.props.id}
                    type={this.props.type} 
                    name={this.props.name} 
                    value={this.props.value} 
                    onChange={this.props.onChange}/>      
                <span className="error">{this.state.errorMessage}</span>            
            </div>
        );
    }
}