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

import classNames from 'classnames';
import PropTypes from 'prop-types';
import componentCss from './SliderContent.module.less';
import { imageSettingState } from '../../../recoilConfig'
import { useRecoilValue } from 'recoil'


const SliderContent = ({ children, translate, transition, width }) => {
    const contextSettingsState = useRecoilValue(imageSettingState);
    const { currentSettings: { Transition } } = contextSettingsState;
    const style = {
        transform: Transition === 'Slide' && `translateX(-${translate}px)`,
        transition: Transition === 'Slide' && `transform ${transition}s  ease 0s`,
        width: `${width}px`
    };
    const renderChildren = () => {
        return children;
    };

    const { url } = children[0].props;
    return (
        <div
            key={url}
            className={classNames({
                [componentCss['sliderContent']]: true,
                [componentCss['fade-in']]: Transition === 'Fade In'
            })}
            style={style}
        >
            {renderChildren()}
        </div>
    );
};

SliderContent.propTypes = {
    children: PropTypes.array,
    direction: PropTypes.string,
    transition: PropTypes.number,
    translate: PropTypes.number,
    width: PropTypes.number
};

export default SliderContent;
