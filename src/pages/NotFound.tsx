import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="full-notif">
            <h1 className="text-4xl lg:text-6xl font-bold m-4">Not Found</h1>
            <p className="text-lg lg:text-xl font-light">We couldn't find that page. Want to go <Link to="/">home</Link>?</p>
        </div>
    )
}