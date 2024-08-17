import React from "react";
import {LoadingItem} from "./LoadingItem.jsx";
import {BiDownload} from "react-icons/bi";
import {ImageViewer} from "./ImageViewer.jsx";

const GeneratedItem = ({
                           mode,
                           item,
                           loadingData,
                           onStopGenerating,
                           onClear,
                           onGenerate,
                           isGenerateBtnDisabled,
                           badgeText,
    elapsedTime,
                           idleIcon,
                       }) => {

    if (loadingData) {
        return (
            <div className="ShowcaseViton__GeneratedItemWrapper">
                <LoadingItem elapsedTime={elapsedTime} loadingData={loadingData}/>

                <div className="ShowcaseViton__GeneratedItemWrapper__LeftBadge">{badgeText}</div>

                <button onClick={onStopGenerating}>Stop generating</button>
            </div>)
    }

    if (!item) {
        return (
            <div className="ShowcaseViton__GeneratedItemWrapper">
                <div className={"GeneratedItem"}>
                    <div className={"GeneratedItem__Idle"}>
                        {idleIcon}
                    </div>
                </div>

                <div className="ShowcaseViton__GeneratedItemWrapper__LeftBadge">{badgeText}</div>

                <button onClick={onGenerate}
                        disabled={isGenerateBtnDisabled}>Generate {mode}</button>
            </div>
        )
    }


    const viewer = mode === <ImageViewer url={item}/>

    return (
        <div className="ShowcaseViton__GeneratedItemWrapper">
            <div className={"GeneratedItem"}>
                {viewer}

                <div className={"GeneratedItem__DownloadWrapper"}>
                    <a href={item} download target={"_blank"}><BiDownload/></a>
                </div>
            </div>

            <div className="ShowcaseViton__GeneratedItemWrapper__LeftBadge">{badgeText}</div>

            <button onClick={() => onClear(mode)}>Clear</button>
        </div>
    );
};

export default GeneratedItem;