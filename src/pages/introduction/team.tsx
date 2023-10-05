import TeamCard from '@/components/page_specific/introduction/TeamCard';
import { NextPage } from 'next';

const teams: Team[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1668479242505-3476b126f400?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyMXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1668380298208-de2df24d3a54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1668380298208-de2df24d3a54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1668479242505-3476b126f400?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyMXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1668380298208-de2df24d3a54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1668380298208-de2df24d3a54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
    position: "Position"
  }
]

const IntroductionTeam: NextPage = () => {
  return (
    <section className="team lg:pt-4 pt-4">
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="title-section mb-2" data-aos="fade-right">thành viên</h1>
        <span className="span-section">Đội ngũ Khoảng Trời Của Bé</span>
      </div>
      <div className="team-form">
        {teams.map((team) => (
          <TeamCard team={team} />
        ))}
      </div>
    </section>
  )
}

export default IntroductionTeam;
