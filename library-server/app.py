from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Book:
    def __init__(self, id, title, author, img):
        self.id = id
        self.title = title
        self.author = author
        self.img = img

books = [    Book(1, 'The Catcher in the Rye', 'J.D. Salinger', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg/640px-The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg'),    
             Book(2, 'To Kill a Mockingbird', 'Harper Lee', 'https://cdn.britannica.com/21/182021-050-666DB6B1/book-cover-To-Kill-a-Mockingbird-many-1961.jpg'),    
             Book(3, '1984', 'George Orwell', 'https://target.scene7.com/is/image/Target/GUEST_f0bc34a6-e4a2-4b71-b133-44fb400fed5b?wid=740&hei=740&qlt=80&fmt=pjpeg'),
        ]

@app.route('/books', methods=['GET'])
def get_books():
    return jsonify([book.__dict__ for book in books])

@app.route('/books/<book_id>', methods=['GET'])
def get_book(book_id):
    book = next((book for book in books if book.id == int(book_id)), None)
    if book:
        return jsonify(book.__dict__)
    else:
        return jsonify({'error': 'Book not found'})

@app.route('/books', methods=['POST'])
def create_book():
    data = request.json
    if len(books) == 0:
        new_book_id = 1
    else:
        new_book_id = books[-1].id + 1
    book = Book(id=new_book_id, title=data['title'], author=data['author'], img=data['img'])
    books.append(book)
    return jsonify(book.__dict__)

@app.route('/books/<book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.json
    book = next((book for book in books if book.id == int(book_id)), None)
    if book:
        book.title = data['title']
        book.author = data['author']
        book.img = data['img']
        return jsonify(book.__dict__)
    else:
        return jsonify({'error': 'Book not found'})

@app.route('/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    global books
    books = [book for book in books if book.id != int(book_id)]
    return jsonify({'message': 'Book deleted'})
