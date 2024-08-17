import './styles/Modal.css';
import './styles/index.css';
import {VitonView} from "./VitonView.jsx";
import garment1 from './assets/garment1.jpg';
import garment2 from './assets/garment2.jpg';

function App() {

    const images = [garment1, garment2];

    return (
        <div className={"root"}>

            <Header />

            <VitonView images={images}/>

            <Footer />

        </div>


    )
}



const Header = () => {
    return (<>
            <h1>Virtual try-on</h1>
        </>
    )
}

const Footer = () => {
    return (
        <div>
            <a href="https://www.thetaedgecloud.com" target="_blank">
                <img src={"https://www.thetaedgecloud.com/images/edgecloud-logo.svg"} className="logo"
                     alt="Theta Edge Cloud logo"/>
            </a>
        </div>
    )
}

export default App