import { debugText } from '../../ClassesAndFunctions/MiniFunctions'
import CustomComplex from '../../Editor/FrameLogic/CustomComplex'
import { FrameComponent } from '../../Editor/FrameLogic/FrameComponent'
import { ProjectTree } from '../../Editor/ProjectTree'
import SimpleCommand from '../SimpleCommand'

export default class ChangeFrameWc3Texture extends SimpleCommand {
    private frame: string
    private oldTexture?: string
    private newTexture: string
    private which: 'normal' | 'back'

    public constructor(frame: FrameComponent | string, texture: string, which: 'normal' | 'back') {
        super()

        if (typeof frame === 'string') {
            this.frame = frame
        } else {
            this.frame = frame.getName()
        }

        this.newTexture = texture
        this.which = which
    }

    public pureAction(): void {
        const frame = ProjectTree.getInstance().findByName(this.frame)

        if (typeof frame === 'undefined') {
            debugText('Could not find frame.')
            return
        }

        if (!(frame.custom instanceof CustomComplex)) {
            debugText('Frame not CustomComplex')
            return
        }

        this.oldTexture = frame.custom.getWc3Texture(this.which)
        frame.custom.setWc3Texture(this.newTexture, this.which)
    }

    public undo(): void {
        if (this.oldTexture) {
            const command = new ChangeFrameWc3Texture(this.frame, this.oldTexture, this.which)
            command.pureAction()
        }

        super.undo()
        debugText('Undid change frame wc3 texture')
    }

    public redo(): void {
        super.redo()
        debugText('Redid change frame wc3 texture')
    }
}
