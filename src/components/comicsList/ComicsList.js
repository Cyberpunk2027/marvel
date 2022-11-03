import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './comicsList.scss';
import React from 'react';


const ComicsList = () => {
    const [comicsList, setComicsList] = useState([])
    const [newItemLoading, setnewItemLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService()

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => { //для загрузки большего кол-ва персонажей, отвечает за запрос на сервер
        initial ? setnewItemLoading(false) : setnewItemLoading(true) //определение, загрузка первичная или вторичная (фикс бага при load more и перерисовке всех айтемов)
        getAllComics(offset) //получаем элементы с сервера
        .then(onComicsListLoaded) //и запускаем onComicsListLoaded, который получает в себя новые данные
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false
        if (newComicsList.length < 8) {
            ended = true
        }
        setComicsList([...comicsList, ...newComicsList])
        setnewItemLoading(false)
        setOffset(offset + 8)
        setComicsEnded(ended)
    }


    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return(
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return(
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList)
    
    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !newItemLoading ? <Spinner/> : null

    return(
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}

            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : comicsEnded ? 'none' : 'block'}} //стиль на случай, если мы дошли до конца списка персов, кнопка исчезает
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
        
    )
}

export default ComicsList;