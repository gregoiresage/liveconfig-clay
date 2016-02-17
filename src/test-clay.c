#include <pebble.h>

static Window *window;
static TextLayer *text_layer;

static bool   active;
static GColor color;


static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  text_layer = text_layer_create(GRect(0, 62, bounds.size.w, 60));
  text_layer_set_text(text_layer, "Change the background in the configuration page");
  text_layer_set_background_color(text_layer, GColorClear);
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(text_layer));
}

static void window_unload(Window *window) {
  text_layer_destroy(text_layer);
}

static void in_received_handler(DictionaryIterator *iter, void *context) {
  Tuple *tuple = NULL;

  tuple = dict_find(iter, 0);
  if(tuple) {
    APP_LOG(0, "active %ld", tuple->value->int32);
    active = tuple->value->int32;
  }

  tuple = dict_find(iter, 1);
  if(tuple) {
    APP_LOG(0, "color %ld", tuple->value->int32);
    color = GColorFromHEX(tuple->value->int32);
  }

  if(active) {
    window_set_background_color(window, color);
  }
  else {
    window_set_background_color(window,GColorWhite);
  }
}

static void init(void) {

  active  = false;
  color   = GColorWhite;

  app_message_open(60, 0);
  app_message_register_inbox_received(in_received_handler);

  window = window_create();
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  window_stack_push(window, true);
}

static void deinit(void) {
  window_destroy(window);
  app_message_deregister_callbacks();
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
