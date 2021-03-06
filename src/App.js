import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';



export default () =>{

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () =>  {
      //pegar a lista dos filmes
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //pegar o featured
      let originals = list.filter(i=>i.slug === 'originals');
      let escolhaAleatoria = Math.floor(Math.random()*(originals[0].items.results.length - 1));
      let escolhido = originals[0].items.results[escolhaAleatoria];
      let escolhidoInfo = await Tmdb.getMovieInfo(escolhido.id, 'tv');
      setFeaturedData(escolhidoInfo);
      
    }
  
    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 20){
        setBlackHeader(true);  
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  },[]);

  return (
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData &&
         <FeaturedMovie item={featuredData} />
      }  

      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito por Daniel Zanelato<br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>
      {movieList.length <= 0 &&
        <div className='loading'>
          <img src="https://www.rchandru.com/images/portfolio/loading.gif" alt="Carregando" />
        </div>
      }
    </div>
  );
}