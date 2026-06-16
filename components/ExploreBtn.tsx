import Image from "next/image"

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto">
        <a href="#events">
            ExploreBtn
            <Image src={"/icons/arrow-down.svg"} alt="arrow down" height={24} width={24}/>
        </a>
    </button>
  )
}

export default ExploreBtn