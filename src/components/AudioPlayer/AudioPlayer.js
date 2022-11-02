// Copyright (c) 2021 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Provides Goldstone-themed Audio player component with out of the box features.
 *
 * @exports AudioPlayer
 */
import PropTypes from "prop-types";
import AudioPlayerBase from "./AudioPlayerBase/AudioPlayerBase";

/**
 * @param {Object} obj
 * @param {import('../../models/Music').default} obj.song
 */
const AudioPlayer = ({ handleNext, handlePrevious, song, ...rest }) => {
    return (
        <AudioPlayerBase
            {...rest}
            onJumpForward={handleNext}
            onJumpBackward={handlePrevious}
            loop={false}
            poster={song.imageUrl}
            thumbnailSrc={song.imageUrl}
            title={song.title}
            artist={song.artist}
            album={song.album}
            infoComponents={song.title}>
            <source src={song.res.url} type={song.mimeType} />
        </AudioPlayerBase>
    );
};

AudioPlayer.propTypes = {
    /**
     * Function to handle Next audio
     *
     * @type {Function}
     */
    handleNext: PropTypes.func,

    /**
     * Function to handle Previous audio
     *
     * @type {Function}
     */
    handlePrevious: PropTypes.func,

    /**
     * song to play
     *
     * @type {Array}
     */
    song: PropTypes.object,
};

export default AudioPlayer;
