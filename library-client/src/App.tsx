import { Badge, Button, Card, Container, Grid, Group, Title, Text, Image, TextInput, Flex, Box } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { queryClient } from './main'
import { Books, NewBook, useBookCreate, useBookDelete, useBooksQuery, useBookUpdate } from './services'

function HTTPRequest() {

  const imgSrcRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)
  const [newTitle, setNewTitle] = useState<string>("")
  const [newAuthor, setNewAuthor] = useState<string>("")
  const { data } = useBooksQuery()
  const deleteMutation = useBookDelete()
  const createMutation = useBookCreate()
  const updateMutation = useBookUpdate()


  const onCall = async (data: Books) => {
    if (newTitle !== "") {
      data.title = newTitle
    }
    if (newAuthor !== "") {
      data.author = newAuthor
    }
    updateMutation.mutate(data)

  }


  const onAdd = async () => {
    if (imgSrcRef.current!.value !== "" && titleRef.current!.value !== "" && authorRef.current!.value !== "") {
      const newBook: NewBook = {
        "title": titleRef.current!.value,
        "author": authorRef.current!.value,
        "img": imgSrcRef.current!.value
      }

      createMutation.mutate(newBook)
      imgSrcRef.current!.value = ""
      authorRef.current!.value = ""
      titleRef.current!.value = ""

    }
  }


  return (
    <Flex direction="column" gap={4} >

      <Group>
        <TextInput ref={titleRef} placeholder="Enter Book Title" />
        <TextInput ref={authorRef} placeholder="Enter Book Author" />
        <TextInput ref={imgSrcRef} placeholder="Enter Image src link" />
        <Button onClick={() => onAdd()}> Add </Button>
      </Group>
      <Flex direction={"row"} gap={4} py={20} wrap="wrap">

        {data && data.map(book =>
          <Card p="sm" shadow="sm" withBorder>
            <Card.Section>
              <Link to={`/books/${book.id}`}> 
                <Image
                  src={book.img}
                  height={160}
                  width={160}
                  alt={book.title}
                />
              </Link>
            </Card.Section>

            <TextInput defaultValue={book.title} onChange={(e) => setNewTitle(e.target.value)} label="Title" />
            <TextInput defaultValue={book.author} onChange={(e) => setNewAuthor(e.target.value)} label="Author" />

            <Group>

              <Button onClick={() => onCall(book)}>Update</Button>
              <Button onClick={() => deleteMutation.mutate(book)}>Delete</Button>
            </Group>
          </Card>
        )}
      </Flex>
    </Flex>
  )
}

function BookPage() {
  const params = useParams()
  console.log(params)
  return (
    <Text> This is book id {params.id} </Text>
  )
}

function App() {

  return (
    <Container>
      <Title order={1} align="center"> Books Application </Title>
      <Routes>
        <Route path="/" element={<HTTPRequest />} />
        <Route path="/books/:id" element={<BookPage />} />
      </Routes>
    </Container>

  )
}

export default App
