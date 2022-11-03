import './charInfo.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'
import useMarvelService from '../../services/MarvelServices';
import  React from 'react'

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null) //стейт содержит "ничего"
    const {loading, error, getCharacter, clearError} = useMarvelService()


    const marvelService = useMarvelService()

    useEffect (() => {
        updateChar()
    }, [props.charId]                         
    )


    const updateChar = () => {
        const {charId} = props
        
        if(!charId){
            return
        }
        clearError()
        getCharacter(charId)
            .then(onCharLoaded) //когда приходит ответ от сервера, он попадает в CharId, тогда включается этот метод
    }

    const onCharLoaded = (char) => {
        setChar(char); 
    }
        


    const skeleton = char || loading || error ? null : <Skeleton/> //заглушка, пока не выбран персонаж
    const errorMessage = error ? <ErrorMessage/> : null 
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || error || !char) ? <View char={char}/> : null
    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
    

}
const View = ({char}) => {
    
        const {name, description, thumbnail, homepage, wiki, comics} = char

        let imgStyle = {'objectFit' : 'cover'} //фикс обрезанной картинки image not found
        if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'}
        }

        return(
            </*Это реакт фрагмент*/> 
                <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main" target="__blank">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary" target="__blank">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'No comics found for this character!' /* заглушка при отсутствии комиксов*/}
                    {
                        comics.map((item, i) =>{
                            if(i > 9) return //если комиксов больше 10, верстка не формируется
                            return(
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        })
                    }

                    
                </ul>
            </>
        )
    }


CharInfo.propTypes = { //типизация
    charId: PropTypes.number 
}
export default CharInfo;