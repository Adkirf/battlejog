import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './code/components/Home'
import Login from './code/components/Login'
import Game from "./code/components/Game"

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/login' } element={<Login/>}/>
                <Route path={'/game' } element={<Game/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App


