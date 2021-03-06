export const CREATE_BOOKS = 'CREATE_BOOKS';

export const getBooksAction = (state, merge = false, onLoad = () => {}) => {
    return (dispatch, getState) => {
        const {books} = getState();
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${state.text}+subject:${state.categories}&orderBy=${state.sort}&startIndex=${state.startIndex}&maxResults=30&key=AIzaSyAM866byHG_AquX8S1BBCyC-PMvdnH1VTs`)
            .then(response => response.json())
            .then(data => {
                if (!data.items) {
                    onLoad(false)
                    data.item = []
                }

                const items = data.items.map( (item) => {
                    if (!item.volumeInfo.authors) {
                        item.volumeInfo.authors = ['-']
                    }
                    return item.volumeInfo
                })

                dispatch({
                    type: CREATE_BOOKS,
                    payload: {
                        items: merge ? books.concat(items) : items,
                        totalBooks: data.totalItems
                    }
                });
                setTimeout(() => {
                    onLoad(false);
                }, 500)
            })
            .catch(() => alert('The request failed'));
    };
};