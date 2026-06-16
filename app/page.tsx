import EventCards from "@/components/EventCards"
import ExploreBtn from "@/components/ExploreBtn"
import { events } from "@/data/home/homeData"

const page = () => {
  const data = events
  return (
    <section className="mt-10 px-5 sm:px-10">
      <h1 className="text-center">The Hub for EveryDev <br/> Event you can't Miss</h1>
      <p className ="text-center mt-5">Hackathons, Meetuos, and confrence, All in one place</p>

      <ExploreBtn/>

      <div className="space-y-7 mt-10">
        <h3>Featured Events</h3>

        <ul className="events">
          {
            events.map((event,ind)=>(
              <li key={ind}>
                <EventCards {...event}/>
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  )
}

export default page