import { Badge, Button, Card, Container, Grid, Group, Title, Text, Image, TextInput, Flex, Box } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'


type Books = {
  "title" : string,
  "id" : number,
  "author": string,
  "img" : string
}
type NewBook = {
  "title" : string,
  "author": string,
  "img" : string
}

function HTTPRequest(){
  const [books, setBooks] = useState<Books []>()
  const imgSrcRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)
  const [newTitle, setNewTitle] = useState<string>("")
  const [newAuthor, setNewAuthor] = useState<string>("")

  const onFetch = async () => {
    const req = await fetch("http://127.0.0.1:5000/books", { method: "GET"})
    const response = await req.json()
    setBooks(response)
  }

  useEffect(() => { onFetch() },[])

  const onUpdate = async (data: Books) => {
    await fetch(`http://127.0.0.1:5000/books/${data.id}`, { method: "PUT", headers: {"Content-Type" : "application/json"}, body: JSON.stringify(data)})
  }

  const onCall = async (data: Books) => {
    if (newTitle !== ""){
      data.title = newTitle
    }
    if (newAuthor !== ""){
      data.author = newAuthor
    }
    await onUpdate(data)
    await onFetch()
  }

  const onCreate = async (data: NewBook) => {
    await fetch("http://127.0.0.1:5000/books", {method: "POST" , headers: {"Content-Type" : "application/json"}, body: JSON.stringify(data)})
  }

  const onAdd = async () => {
    if (imgSrcRef.current!.value !== "" && titleRef.current!.value !== "" && authorRef.current!.value !== "" ){
      const newBook : NewBook = {
        "title" : titleRef.current!.value,
        "author": authorRef.current!.value,
        "img" : imgSrcRef.current!.value
      }

      await onCreate(newBook)
      imgSrcRef.current!.value = ""
      authorRef.current!.value = ""
      titleRef.current!.value = ""
      await onFetch()
    }
  }

  const onDelete = async (data:Books) => {
    await fetch(`http://127.0.0.1:5000/books/${data.id}`, { method: "DELETE"})
    await onFetch()
  }

  return(
    <Flex direction="column" gap={4} >
      
      <Group>
        <TextInput ref={titleRef} placeholder="Enter Book Title" />
        <TextInput ref={authorRef} placeholder="Enter Book Author" />
        <TextInput ref={imgSrcRef} placeholder="Enter Image src link" />
        <Button onClick={() => onAdd()}> Add </Button>
      </Group>
      <Flex direction={"row"} gap={4} py={20} wrap="wrap">

      
       {books && books.map(book => 
          <Card p="sm" shadow="sm" withBorder>
            <Card.Section>
              <Image
                src = {book.img}
                height={160}
                width={160}
                alt= {book.title}
              />
            </Card.Section>
            
            <TextInput  defaultValue={book.title} onChange={(e) => setNewTitle(e.target.value)} label="Title" />
            <TextInput  defaultValue={book.author} onChange={(e) => setNewAuthor(e.target.value)} label="Author" />
            
            <Group>
              <Button onClick={() => onCall(book)}>Update</Button>
              <Button onClick={() => onDelete(book)}>Delete</Button>
            </Group>
          </Card>
        )}
      </Flex>
    </Flex>
  )
}


function App() {

  return (
    <Container>
      <Title order={1} align="center"> Books Application </Title>
      <HTTPRequest />
    </Container>
    
  )
}

export default App
