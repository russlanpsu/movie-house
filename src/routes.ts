import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import About from './pages/About.tsx'
import Home from './pages/Home.tsx'
import { MoviePage } from './pages/MoviePage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
       { path: 'film/:id', Component: MoviePage }
    ],
  },
])
