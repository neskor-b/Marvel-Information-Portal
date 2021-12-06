import { Component } from 'react';
import Spiner from '../spiner/Spiner';
import ErrorMesage from '../errorMesage/ErrorMesage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            charList: [],
            loading: true,
            error: false,
            newItemLoading: false,
            offset: 210,
            charEnded: false
        }
    }


    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderItems(arr) {
        const { onCharSelected } = this.props
        const items = arr.map((item) => {
            return (
                <li onClick={() => onCharSelected(item.id)}
                    className="char__item"
                    key={item.id}>
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, newItemLoading, offset, charEnded } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMesage /> : null;
        const spinner = loading ? <Spiner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={()=> this.onRequest(offset)}
                    style={charEnded? {display:"none"}:{display:"block"}}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;