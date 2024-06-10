import React, { useContext } from 'react'
import { Context } from '../../main'
import { Link } from 'react-router-dom'
import {BeatLoader} from 'react-spinners'

const HeroSection = () => {
  
  const {blogs} = useContext(Context)
  
  return (
    <section className='hero' >
      {
        blogs && blogs.length > 0 ? (blogs.slice(0,2).map(element=>{
          return (
            <>
                <Link to={`/blog/${element._id}`} className="card" key={element._id}>
              <img src={element.mainImage.url} alt="blog" className="blogImg" />
              <div className="category">{element.category}</div>
              <h1>{element.title}</h1>
              <div className="writer_section">
                <div className="author">
                  <img src={element.authorAvatar} alt="author_avatar" />
                  <p>{element.authorName}</p>
                </div>
              </div>
            </Link>
            </>
          
          )
        })) : (
          <BeatLoader size={30} color='gray' style={{display:"flex",
          justifyContent:"center",alignItems:"center",width: "100%"}}/>
        )
      } 
    </section>
  )
}

export default HeroSection