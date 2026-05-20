# ui_sidebar_items

| Field          | Type                        | Required | Mô tả                                           |
| -------------- | --------------------------- | -------- | ----------------------------------------------- |
| `id`           | uuid / ulid                 | yes      | Primary key                                     |
| `key`          | string                      | yes      | Unique key, ví dụ `dashboard`, `settings_group` |
| `title`        | string                      | yes      | Label mặc định                                  |
| `translations` | json                        | no       | Label đa ngôn ngữ                               |
| `icon`         | string                      | no       | Icon key, ví dụ `Settings`, `CircleGauge`       |
| `type`         | enum                        | yes      | Loại sidebar item                               |
| `page_id`      | m2o → `ui_pages.id`         | no       | Link tới page thật                              |
| `parent_id`    | m2o → `ui_sidebar_items.id` | no       | Self relation để tạo nested menu                |
| `sort_order`   | integer                     | yes      | Thứ tự trong cùng parent                        |
| `is_enabled`   | boolean                     | yes      | Bật/tắt item                                    |
| `is_visible`   | boolean                     | yes      | Có hiện trên sidebar không                      |
| `permissions`  | json                        | no       | Điều kiện role/user/feature flag                |
| `props`        | json                        | no       | Config phụ cho UI                               |
