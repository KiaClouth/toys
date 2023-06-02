extern crate wasm_bindgen;

use std::cell::Cell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::console;

#[wasm_bindgen]
pub fn hcl_init() -> Result<(), JsValue> {
    // let window = web_sys::window().expect("异常：无法访问到windows对象！");
    let window = match web_sys::window() {
        Some(w) => w,
        None => {
            console::log_1(&format!("异常：无法访问到windows对象！").into());
            panic!("异常：无法访问到windows对象！")
        }
    };
    let document = match window.document() {
        Some(d) => d,
        None => {
            console::log_1(&format!("异常：无法访问到document对象！").into());
            panic!("异常：无法访问到document对象！")
        }
    };
    let canvas = match document.get_element_by_id("wasmCanvas") {
        Some(c) => c.dyn_into::<web_sys::HtmlCanvasElement>()?,
        None => {
            console::log_1(&format!("异常：无法访问到canvas对象！").into());
            panic!("异常：无法访问到canvas对象！")
        }
    };
    let context = match canvas.get_context("2d")? {
        Some(c) => c.dyn_into::<web_sys::CanvasRenderingContext2d>()?,
        None => {
            console::log_1(&format!("异常：无法访问到context对象！").into());
            panic!("异常：无法访问到context对象！")
        }
    };

    let context = Rc::new(context);
    let pressed = Rc::new(Cell::new(false));

    {
        mouse_down(&context, &pressed, &canvas);
    }
    {
        mouse_move(&context, &pressed, &canvas);
    }
    {
        mouse_up(&context, &pressed, &canvas);
    }

    Ok(())
}

fn mouse_up(
    context: &std::rc::Rc<web_sys::CanvasRenderingContext2d>,
    pressed: &std::rc::Rc<std::cell::Cell<bool>>,
    canvas: &web_sys::HtmlCanvasElement,
) {
    let context = context.clone();
    let pressed = pressed.clone();
    let closure = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
        pressed.set(false);
        context.line_to(event.offset_x() as f64, event.offset_y() as f64);
        context.stroke();
    }) as Box<dyn FnMut(_)>);
    canvas
        .add_event_listener_with_callback("mouseup", closure.as_ref().unchecked_ref())
        .unwrap();
    closure.forget();
}

fn mouse_move(
    context: &std::rc::Rc<web_sys::CanvasRenderingContext2d>,
    pressed: &std::rc::Rc<std::cell::Cell<bool>>,
    canvas: &web_sys::HtmlCanvasElement,
) {
    let context = context.clone();
    let pressed = pressed.clone();
    let closure = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
        if pressed.get() {
            context.line_to(event.offset_x() as f64, event.offset_y() as f64);
            context.stroke();
            context.begin_path();
            context.move_to(event.offset_x() as f64, event.offset_y() as f64);
        }
    }) as Box<dyn FnMut(_)>);
    canvas
        .add_event_listener_with_callback("mousemove", closure.as_ref().unchecked_ref())
        .unwrap();
    closure.forget();
}

fn mouse_down(
    context: &std::rc::Rc<web_sys::CanvasRenderingContext2d>,
    pressed: &std::rc::Rc<std::cell::Cell<bool>>,
    canvas: &web_sys::HtmlCanvasElement,
) {
    let context = context.clone();
    let pressed = pressed.clone();
    let closure = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
        context.begin_path();
        context.set_line_width(5.0);
        context.move_to(event.offset_x() as f64, event.offset_y() as f64);
        pressed.set(true);
    }) as Box<dyn FnMut(_)>);
    canvas
        .add_event_listener_with_callback("mousedown", closure.as_ref().unchecked_ref())
        .unwrap();
    closure.forget();
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    let bytes = name.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b'l' {
            console::log_1(&format!("{}", &name[..i]).into());
            return;
        }
    }
    console::log_1(&format!("Hello, {}", &name[..]).into());
}
