import {useHttp} from '../hooks/http.hook'

const useMarvelService = () => { 

    const {loading, request, error, clearError} = useHttp()

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    const _apiKey = 'apikey=3e34c08d41de8d84f674af7ef3ed8c55'
    const _baseOffset = 210 //базовый отступ кол-ва персонажей



    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter) //формируем массив с новыми объектами и передаем в трансформ
    }

    const getCharacter = async (id) => { //фун-я ассинхронна, сначала дожидаемся результата, потом запись в переменную
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]) // возвращается трансформ, в котором только нужные данные (объект персонажа)
    }

    const getAllComics = async (offset = 0) => {
        const res = await request (`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformComics)
    } 

    const getComic = async (id) => {
        const res = await request (`${_apiBase}comics/${id}?${_apiKey}`)
        return _transformComics(res.data.results[0])
    }

    const _transformCharacter = (char) => { //в аргументе стоит char- объект персонажа
        return {
            id: char.id,
            name: char.name, //результат(один большой объект), в нем есть data(данные которые мы получили), в дате есть поле results(массив с данными), в нем обращаемся к 1му персу, образаемся к значению name
            description: char.description ? `${char.description.slice(0, 210)}...` :'Oops... There is no description for this character!', //проверка при получении дескрипшн, если больше 210 символов, ставится троеточие, если его нет- текст-заглушка
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension, // конкатенация строк, т.к. thumbnail состоит из двух св-в
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
    

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There's no description for this comics!",
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || "en-us",
            price: comics.prices.price ? `${comics.prices.price}$` : "not available"
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic}
    
}

export default useMarvelService