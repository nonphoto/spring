import Vector from '@nonphoto/vector'

function dampen(f, v, constant = 1) {
    const dampeningForce = Vector.clone(v).scale(constant)
    return Vector.clone(f).subtract(dampeningForce)
}

function spring(a, b, constant = 1, length = 0, expansion = true, compression = true) {
    const separation = Vector.clone(b).subtract(a)
    const lengthDifference = separation.length - length

    if (!expansion && lengthDifference < 0) {
        return new Vector()
    }

    if (!compression && lengthDifference > 0) {
        return new Vector()
    }

    return separation.normalize().scale((lengthDifference) * -constant)
}

export { spring, dampen }
