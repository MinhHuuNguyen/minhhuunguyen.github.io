import { NextPage } from 'next';
import newsData from '../../utils/news.json';

const news = newsData[0];

const News: NextPage = () => {
  return (
    <section className="news lg:pt-4 pt-4 mb-5">
      <div className="flex flex-wrap ">
        <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-12 lg:w-2/3 pr-4 pl-4 w-full">
          <div className="flex justify-between items-center w-full">
            <span className="news-status">{news.status}</span>
            <span className="news-posted">{news.time}</span>
          </div>
          <h2 className="news-title">
            {news.title}
          </h2>
          {news.contents.map((content) => 
            <p className="news-content">{content}</p>
          )}
        </div>
        <div className="flex flex-col align-center justify-start gap-4 lg:px-6 lg:w-1/3 pr-4 pl-4 w-full lg:mt-0 mt-4">
          {news.images.map((image) => 
            <div className="news-image">
              <div className="news-image-frame">
                <img src={image.src} alt={image.alt} />
              </div>
              <p>{image.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default News;
