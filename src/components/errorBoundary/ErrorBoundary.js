import React from "react"
import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";


//КОМПОНЕНТ ПРЕДОХРАНИТЕЛЬ
class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo){
        console.log(error, errorInfo)

        this.setState({
            error: true //устанавливаем состояние по умолчанию тру
        })
    }

    render() {
        if(this.state.error){ //если error в позиции true
            return <ErrorMessage/> //вернется эта строка
        }

        return this.props.children
    }
}

export default ErrorBoundary