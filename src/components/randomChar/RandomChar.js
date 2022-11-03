import { useState, useEffect } from 'react';
import './randomChar.scss';
import useMarvelService from '../../services/MarvelServices'
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import mjolnir from '../../resources/img/mjolnir.png';
import  React from 'react'

const RandomChar = () => {
        const [char, setChar] = useState(null) //стейт содержит "ничего"
        
        const {loading, error, getCharacter, clearError} = useMarvelService() //создаем новое свойство

        useEffect ( () => {
                updateChar()
                const timerId = setInterval(updateChar, 60000)

                return () => {
                    clearInterval(timerId)
                }
        }, [])

    const onCharLoaded = (char) => {
        setChar(char); 
    }


    const updateChar = () => { //метод изменения состояния
        clearError()
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000) //Math.floor округляет, далее рандомайзер в диапазоне идшников персов плюс минимальное значение диапазона
        getCharacter(id) //ид получаем в аргументе коллбэк фун-и и сразу передаем в сетстейт
            .then(onCharLoaded)
    }

    const errorMessage = error ? <ErrorMessage/> : null //проверка на наличие ошибки: выдаст или компонент или null
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || error) ? <View char={char}/> : null /*проверяем, есть ли loading, если да, то в этот участок верстки ставим спиннер, если нет, то ставим рендер-компонент иначе ставим null*/

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )

}
//рендерящий компонент
const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki} = char || {} //фикс ошибки "cannot destructure property as it is null"
    let imgStyle = {'objectFit' : 'cover'} //фикс обрезанной картинки image not found
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'}
    }

    return (
        <div className="randomchar__block">
                    <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name}</p>
                        <p className="randomchar__descr">{description}</p>
                        <div className="randomchar__btns">
                            <a href={homepage} className="button button__main" target="_blank">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary" target="_blank">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
    )
}

export default RandomChar;