
import { useSetRecoilState } from 'recoil'
import { filePathState, filesState } from '../recoilConfig'

export default function useSetFilePath() {
    /** @type {Function} */
    const setFilePath = useSetRecoilState(filePathState)
    /** @type {Function} */
    const setFiles = useSetRecoilState(filesState)

    return path => {
        setFilePath(path)
        setFiles(null)
    }
}
