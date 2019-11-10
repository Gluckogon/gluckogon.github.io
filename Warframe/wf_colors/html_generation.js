'use strict'

const palettes_nodes = {}
const palettes_thumbnails_node = document.getElementById('palettes_thumbnails')
const selected_palette_node = document.getElementById('selected_palette')
const selected_color_node = document.getElementById('selected_color')
const selected_color_text_node = document.getElementById('selected_color_value')
const color_picker_node = document.getElementById('color_picker')
const dublicates_container_node = document.getElementById('dublicates_container')
const sel_col_cell_nodes = {
    'sel_pal_cell_node': null,
    'col_pick_cell_node': null,
    'dupl_cell_node': null,
}
let selected_palette = null
const pal_x_cells_num = 5
const pal_y_cells_num = 18

for (let [palette_name, palette] of Object.entries(palettes_w_ids)) {
    palettes_nodes[palette_name] = {}
    let palette_thumbnail_container = document.createElement('div')
    palette_thumbnail_container.classList.add('palette_thumbnail_container')

    let palette_thumbnail_html_str =
        '<div onclick="select_color(' + palette[0][0] + ')">' +
        '<div class="palette_thumbnail_name">' + palette_name + '</div>' +
        '<table class="palette_thumbnail">'
    for (let i = pal_x_cells_num - 1; i > 0; i--) {
        palette_thumbnail_html_str += '<tr>'
        for (let j = 0; j < pal_y_cells_num; j++) {
            palette_thumbnail_html_str +=
            '<td style="background-color: ' + colors[palette[j][i]].color + ';"></td>'
        }
        palette_thumbnail_html_str += '</tr>'
    }
    palette_thumbnail_html_str += '</table></div>'

    palette_thumbnail_container.innerHTML = palette_thumbnail_html_str
    palettes_thumbnails_node.appendChild(palette_thumbnail_container)
    palettes_nodes[palette_name].thumbnail = palette_thumbnail_container


    let palette_container = document.createElement('div')
    palette_container.style.display = 'none'

    let palette_html_str =
        '<span class="palette_name">' + palette_name + '</span><br />' +
        '<table class="palette">'
    for (let i = 0; i < pal_y_cells_num; i++) {
        palette_html_str += '<tr>'
        for (let j = 0; j < pal_x_cells_num; j++) {
            palette_html_str +=
                '<td id="pal_' + palette[i][j] + '" ' +
                'style="background-color: ' + colors[palette[i][j]].color + ';" ' +
                'onclick="select_color(' + palette[i][j] + ')"></td>'
        }
        palette_html_str += '</tr>'
    }
    palette_html_str += '</table>'

    palette_container.innerHTML = palette_html_str
    selected_palette_node.appendChild(palette_container)
    palettes_nodes[palette_name].palette = palette_container
}

let color_dublicates_html_str = ''
for (let [color, col_ids] of Object.entries(duplicates)) {
    color_dublicates_html_str += '<table class="dublicates_table"><tr>'
    for (let col_id of col_ids) {
        color_dublicates_html_str +=
            '<td id="dupl_' + col_id + '" ' +
            'style="background-color: ' + color + ';" ' +
            'onclick="select_color(' + col_id + ')"></td>'
    }
    color_dublicates_html_str += '</tr></table>'
}
dublicates_container_node.innerHTML = color_dublicates_html_str

for (let [cl_col_gr_name, cl_col_ids] of Object.entries(classified_colors)) {
    const color_picker_sq_side = Math.ceil(Math.sqrt(cl_col_ids.length))

    let color_picker_html_str = '<table class="color_picker">'
    let n = 0;
    for (let i = 0; i < color_picker_sq_side; i++) {
        color_picker_html_str += '<tr>'
        for (let j = 0; j < color_picker_sq_side; j++, n++) {
            if (n === cl_col_ids.length) {
                break
            }
            color_picker_html_str +=
                '<td id="pick_' + cl_col_ids[n] + '" ' +
                'style="background-color: ' + colors[cl_col_ids[n]].color + ';" ' +
                'onclick="select_color(' + cl_col_ids[n] + ')"></td>'
        }
        color_picker_html_str += '</tr>'
    }
    color_picker_html_str += '</table>'

    let color_picker_container = document.createElement('div')
    color_picker_container.classList.add('color_picker_container')
    color_picker_container.innerHTML = color_picker_html_str
    color_picker_node.appendChild(color_picker_container)
}

function select_color(color_id) {
    if (selected_palette !== null) {
        palettes_nodes[selected_palette].thumbnail.classList.toggle('selected_palette_thumbnail')
        toggle_visibility(palettes_nodes[selected_palette].palette)
    }
    selected_palette = colors[color_id].palette
    palettes_nodes[selected_palette].thumbnail.classList.toggle('selected_palette_thumbnail')
    toggle_visibility(palettes_nodes[selected_palette].palette)

    if (sel_col_cell_nodes.sel_pal_cell_node !== null) {
        sel_col_cell_nodes.sel_pal_cell_node.innerHTML = ''
        sel_col_cell_nodes.col_pick_cell_node.innerHTML = ''
    }
    if (sel_col_cell_nodes.dupl_cell_node !== null) {
        sel_col_cell_nodes.dupl_cell_node.innerHTML = ''
    }
    sel_col_cell_nodes.sel_pal_cell_node = document.getElementById('pal_' + color_id)
    sel_col_cell_nodes.col_pick_cell_node = document.getElementById('pick_' + color_id)
    sel_col_cell_nodes.dupl_cell_node = document.getElementById('dupl_' + color_id)

    sel_col_cell_nodes.sel_pal_cell_node.innerHTML = '&#9733;' // ★
    sel_col_cell_nodes.col_pick_cell_node.innerHTML = '&#9679;' // ●
    if (sel_col_cell_nodes.dupl_cell_node !== null) {
        sel_col_cell_nodes.dupl_cell_node.innerHTML = '&#9679;' // ●
    }

    selected_color_text_node.innerHTML = colors[color_id].color
    selected_color_node.style.backgroundColor = colors[color_id].color
}

select_color(0)
