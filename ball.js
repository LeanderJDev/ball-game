// properties and initial velocity
const defaultProps = {
    radius: 30,
    hue: 0
}

class Ball {
    constructor(x = 0, y = 0, sceneProps, props) {
        this.props = {
            ...defaultProps,
            startVelX: (Math.random() + 1) * (Math.floor(Math.random() * 2) || -1),
            startVelY: (Math.random() + 1) * (Math.floor(Math.random() * 2) || -1),
            ...props
        }
        this.sceneProps = sceneProps

        this.x = x
        this.y = y
        this.velX = this.props.startVelX
        this.velY = this.props.startVelY
    }

    draw(ctx) {
        const { x, y, props } = this

        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = 'hsl(' + this.props.hue + ',100%,50%)'
        ctx.strokeStyle = "#000000";
        ctx.arc(
            x, y,
            props.radius,
            0, Math.PI * 2
        )
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }

    bounce(other) {
        var dx = other.x - this.x
        var dy = other.y - this.y
        const radii = this.props.radius + other.props.radius

        var m = Math.sqrt(dx * dx + dy * dy)
        var ux = dx / m
        var uy = dy / m
        var ax = (ux * radii) - dx
        var ay = (uy * radii) - dy
        //other.x += ax / 2
        //other.y += ay / 2
        this.x -= ax
        this.y -= ay



        dx = other.x - this.x
        dy = other.y - this.y
        m = Math.sqrt(dx * dx + dy * dy)
        ux = dx / m
        uy = dy / m
        const tx = -uy
        const ty = ux

        var vx = this.velX * ux + other.velX * tx
        var vy = this.velY * uy + other.velY * ty
        this.velX = -other.velX * ux + this.velX * tx
        this.velY = -other.velY * uy + this.velY * ty
        other.velX = vx
        other.velY = vy
    }

    collide(others) {
        others.forEach(other => {
            if (other == this || (this.velX == 0 && this.velY == 0)) { return }
            var dx = other.x - this.x
            var dy = other.y - this.y
            var radii = this.props.radius + other.props.radius
            if ((dx * dx) + (dy * dy) < radii * radii) {
                this.props.hue += 1
                //console.log(this.props.hue)
                this.bounce(other)
            }
        })
    }

    update(others) {
        const { props, sceneProps } = this

        // bottom bound
        if (this.y + props.radius >= sceneProps.height) {
            this.velY *= -1
            this.y = Math.min(sceneProps.height*2 - this.y,sceneProps.height-props.radius)
        }
        // top bound
        if (this.y - props.radius <= 0) {
            this.velY *= -1
            this.y = Math.max(-this.y,props.radius)
        }

        // left bound
        if (this.x - props.radius <= 0) {
            this.velX *= -1
            this.x = Math.max(-this.x,props.radius)
        }
        // right bound
        if (this.x + props.radius >= sceneProps.width) {
            this.velX *= -1
            this.x = Math.min(sceneProps.width*2 - this.x,sceneProps.width-props.radius)
        }

        this.collide(others)

        // update position
        this.x += this.velX
        this.y += this.velY
    }
}