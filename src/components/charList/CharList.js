import './charList.scss';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelServices';
import  React from 'react'

const CharList = (props) => {

    const [charList, setCharlist] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    const {loading, error, getAllCharacters} = useMarvelService()

    const marvelService = useMarvelService() //создаем новое свойство

    useEffect(() => {
        onRequest(offset, true)  //вызываем в первый раз без аргумента, чтобы ориентировался на baseOffset
    }, [])

    const onRequest = (offset, initial) => { //для загрузки большего кол-ва персонажей, отвечает за запрос на сервер
        initial ? setNewItemLoading(false) : setNewItemLoading(true) //определение, загрузка первичная или вторичная (фикс бага при load more и перерисовке всех айтемов)
        getAllCharacters(offset) //получаем элементы с сервера
        .then (onCharListLoaded) //и запускаем onCharListLoaded, который получает в себя новые данные
    }


    const onCharListLoaded = (newCharList) => { /*принимает новые данные в арге*/
        let ended = false //в случае, когда все персонажи загружены и их больше нет в принципе
        if (newCharList.length < 9) {
            ended = true //если карточек менее 9, то ended в позиции тру
        } 

        setCharlist(charList => [...charList, ...newCharList])//из новых данных формируем новое состояние; 
                                                            /*если в 1й раз запустили то в charList придет пустой массив и тогда развернется 
                                                            newCharList; в последующие запуски будет и старый, и новый список,
                                                            которые будут в одном массиве*/
        setNewItemLoading(newItemLoading => false) //аналогично с newItemLoading
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended) //стейт с состоянием, переданным в переменную
    }


    const itemRefs = useRef([])

    // setRef = (ref) => {
    //     this.itemRefs.push(ref) //добавляем в массив рефы 
        
    // }

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected')) //перебираем айтемы и ремувим цсс класс
        itemRefs.current[id].classList.add('char__item_selected') //добавляем класс
        itemRefs.current[id].focus() //фокус на выбранных табом
    }

   
    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'} //фикс обрезанной картинки image not found
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
                imgStyle = {'objectFit' : 'unset'}
            }
        
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => 
                    {props.onCharSelected(item.id) /*вытаскиваем состояние и устанавливаем новое по клику*/
                    focusOnItem(i)}}
                    onKeyPress={(e) => {
                        if (e.key === '' || e.key === 'Enter') {
                            props.onCharSelected(item.id)
                            focusOnItem(i)
                        }
                    }}> 
                        
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    const items = renderItems(charList)


    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !newItemLoading ? <Spinner/> : null //загрузка, но при этом не загрузка новых айтемов
    // const content = !(loading || error) ? items : null

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}} //стиль на случай, если мы дошли до конца списка персов, кнопка исчезает
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}



CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList