document.addEventListener('DOMContentLoaded', () => {
    fetchQuotes()
    quoteForm()
})

function fetchQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(quotes => {
        for(const quote of quotes){
            addQuote(quote)
        }
    })
}


function addQuote(quote){
    const quoteList = document.getElementById('quote-list')
    const quoteElement = document.createElement('li')
    quoteElement.innerHTML = `
    <li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>
    `
    quoteList.appendChild(quoteElement)

    quoteElement.querySelector('.btn-danger').addEventListener('click', () => {
        quoteElement.remove()
        deleteQuote(quote.id)
        console.log(Date.now())
    })
    quoteElement.querySelector('.btn-success').addEventListener('click', () => {
        const likes = parseInt(quoteElement.querySelector('span').textContent)+1
        quoteElement.querySelector('span').textContent = likes
        addLike(quote.id)
    })
}

function quoteForm(){
    const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', e => {
        e.preventDefault()

        const quote = e.target.querySelectorAll('div')[0].querySelector('input').value
        const author = e.target.querySelectorAll('div')[1].querySelector('input').value

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                'quote': quote,
                'author': author,
                'likes': []
            })
        })
        .then(resp => resp.json())
        .then(quote => {
            addQuote(quote)
        })

        form.reset()
    })
}

function deleteQuote(id){
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
    })
}

function addLike(id){
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            'quoteId': id,
            'createdAt': Math.round(Date.now()/1000)
        })
    })
    .then(resp => resp.json())
    .then(data => console.log(data))
}