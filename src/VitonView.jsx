import React, {useEffect, useState} from "react";
import {ImageInput} from "./components/ImageInput.jsx";
import {generateViton, stopVitonGeneration} from "./VitonAPI.js";
import './styles/Viton.css'
import {BiImage} from "react-icons/bi";
import {LoadingItem} from "./components/LoadingItem.jsx";

export const VitonView = ({images}) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentModel, setCurrentModel] = useState(null);
    const [currentGarment, setCurrentGarment] = useState(null);
    const [currentGarmentUrl, setCurrentGarmentUrl] = useState(images[0]);
    const [imageGenerated, setImageGenerated] = useState(null);

    useEffect(() => {
        return () => {
            stopVitonGeneration()
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(currentGarmentUrl);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    setCurrentGarment(reader.result);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [currentGarmentUrl]);

    const onGenerate = async () => {
        setError(null);
        setLoading(true);
        generateViton({
            garment: currentGarment,
            model: currentModel,
            steps: 20,
        }, onPredictEvent)
    };

    const onImageSelected = async (file, name) => {
        if (!file) return;

        try {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function () {
                if (name === 'garment') {
                    setCurrentGarment(fileReader.result);
                } else if (name === 'model') {
                    setCurrentModel(fileReader.result);
                }
            };
            fileReader.onerror = function (error) {
                console.error("Failed to upload image");
            };
        } catch (e) {
            console.error("Failed to upload image");
        }
    };

    const onPredictEvent = (event) => {
        switch (event.msg) {
            case 'estimation':
                //estimation event is received
                break;
            case 'process_starts':
                //generation started
                break;
            case 'process_completed':
                if (event.success) {
                    setLoading(false);
                    setImageGenerated(event.output.data[0]);
                } else {
                    onError("Failed to generate");
                }
                break;
            case 'error':
            case 'unexpected_error':
                onError(event.error);
                break;
        }
    };

    const onError = (error) => {
        setLoading(false);
        setError(error ?? "Failed to generate. Try again later");
    };

    const onRemoveImage = (name) => {
        if (name === 'model') {
            setCurrentModel(null);
        } else if (name === 'garment') {
            setCurrentGarment(null);
        }
    };

    const onButtonClick = () => {
        if (isLoading) {
            setLoading(false);
            stopVitonGeneration();
        } else if (imageGenerated) {
            setImageGenerated(null);
        } else {
            onGenerate();
        }
    }

    return (
        <div className="ShowcaseViton">
            <div className="ShowcaseViton__Container">
                <div className="ShowcaseViton__LeftSide">
                    <div className={"ShowcaseViton__ImageInputWrapper"}>
                        <ImageInput
                            value={currentModel}
                            name="model"
                            label="Model Image"
                            onChange={onImageSelected}
                            onRemove={onRemoveImage}
                            formats="image/jpeg, image/jpg, image/png"
                        />
                    </div>

                    <div className={"ShowcaseViton__ImageInputWrapper"}>
                        <div className={"ImageInput"}>
                            <img className={"ImageInput__ImageUploaded"}
                                 src={currentGarment}/>
                        </div>
                    </div>

                    {images.length > 1 && <div className={"ShowcaseGallery"}>
                        <div className={"ShowcaseGallery__Images"}>
                            {images.map((image, index) => (
                                <div key={index} className={"ShowcaseGallery__Image"}
                                     onClick={() => setCurrentGarmentUrl(image)}>
                                    <img src={image} />
                                </div>
                            ))}
                        </div>
                    </div>}

                </div>

                <div className="ShowcaseViton__RightSide">
                    <div className={"ShowcaseViton__GeneratedItemName"}>Try-on result</div>
                    {error && <div className="ErrorMessage">{error}</div>}

                    <div className="ShowcaseViton__GeneratedItemWrapper">
                        {isLoading && <div className={"GeneratedItem"}>
                            <div className={"GeneratedItem__Idle"}>
                                <LoadingItem/>
                            </div>
                        </div>}

                        {!isLoading && !imageGenerated && (
                            <div className={"GeneratedItem"}>
                                <div className={"GeneratedItem__Idle"}>
                                    <BiImage/>
                                </div>
                            </div>
                        )}

                        {!isLoading && imageGenerated && (
                            <div className={"GeneratedItem"}>
                                <div className={"GeneratedItem__Image"}>
                                    <a href={imageGenerated} target={"_blank"}>
                                        <img src={imageGenerated} alt={"result"}/>
                                    </a>
                                </div>
                            </div>
                        )}

                        <button onClick={onButtonClick}
                                disabled={!imageGenerated && !currentModel}>
                            {isLoading
                                ? "Stop generating"
                                : imageGenerated
                                    ? "Clear"
                                    : "Generate"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};