import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "../main"

export type Books = {
    "title": string,
    "id": number,
    "author": string,
    "img": string
}
export type NewBook = {
    "title": string,
    "author": string,
    "img": string
}
const url = import.meta.env.VITE_API_URL
function useBooksQuery() {
    return useQuery({
        queryKey: ['books'],
        queryFn: async () => {
            const req = await fetch(`${url}/books`, { method: "GET" })
            const response = await req.json()
            return response as Books[]
        }
    })
}

function useBookDelete() {
    return useMutation({
        mutationKey: ['booksDelete'],
        mutationFn: async (data: Books) => {
            await fetch(`${url}/books/${data.id}`, { method: "DELETE" })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] })
        }
    })
}

function useBookCreate() {
    return useMutation({
        mutationKey: ['booksCreate'],
        mutationFn: async (data: NewBook) => {
            await fetch(`${url}/books`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] })
        }
    })
}



function useBookUpdate() {
    return useMutation({
        mutationKey: ['booksUpdate'],
        mutationFn: async (data: Books) => {
            await fetch(`${url}/books/${data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] })
        }
    })
}
export {useBooksQuery, useBookCreate, useBookDelete, useBookUpdate}