import React from 'react';

import './_privacy.scss';

const Privacy = () => {

  return (
    <div className='privacy'>
        <h3 className='privacy_title'>YouTube API User Data Policy</h3>
        <section className='privacy_text'> 
            <p> Current web-browser App uses YouTube Application Program Interface (API) Services. </p>   
            <p> The App is obtaining API key to access public and private YouTube data via YouTube Data API Services.<br />
             Obtained key is being kept confidential. </p>
            <p> The App, while using by unauthenticated user, is requesting the following publicly available data: <br />
            <li> Name of the YouTube channel, title of the video and playlist, video, channel and playlist thumbnail, number of likes, dislikes and comments for the video. This data is used to provide the user with ability to search for a specific YouTube video, channel or playlist and display the number of likes/dislikes/comments of results.
            </li> </p>
            <p> 
            The App, while using by unauthenticated user, is collecting the following private data:<br />
            <li> List of videos watched by user inside the App and playlists saved inside the App.</li></p>
            <p> The App, while using by authenticated user, is requesting and/or updating the following private data:<br />
            <li> List of user subscriptions and liked videos. This data is used to provide the user with ability to list or add/delete subscriptions and list liked videos.
            </li> </p>
            <p> The data does not leave user's browser. The data will not be transferred to other parties. The data will not be used for serving advertisements.
            </p>
            <p> By using the App you also agree to the <a href="https://www.youtube.com/t/terms" target="_blank">YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank">Google Privacy Policy</a>. </p>
        </section>
    </div>
  )
}

export default Privacy