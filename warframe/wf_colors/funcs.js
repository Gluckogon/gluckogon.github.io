function hex_to_rgb(hex) {
    let int_ = parseInt(hex.slice(1), 16)
    return [int_ >> 16, (int_ >> 8) & 255, int_ & 255]
}

function toggle_visibility(node) {
    node.style.display = (node.style.display === 'none') ? 'block' : 'none'
}
