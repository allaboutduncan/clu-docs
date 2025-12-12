# Insights API

I have made a small number of the Library Insights available as an API endpoint at `/api/insights`.

### Current API Data

```json
{
  "issues_read": 6,
  "root_folders": 88,
  "total_files": 116205,
  "total_size": 4381449407305
}
```
### Homepage Widget

![Homepage Widget](../../assets/insights/widget.png){: .center-image}

If you are using the [Homepage](https://gethomepage.dev/), you can use this API to display the data in your dashboard.

```yaml
    - CLU:
        icon: https://github.com/allaboutduncan/comic-utils/blob/main/static/images/clu.png?raw=true
        href: your-CLU-URL #link the widget to your CLU instance
        description: Comic Library Utilities
        widget:
            type: customapi
            url: http://your-CLU-URL/api/insights #API URL
            refreshInterval: 3600000  # optional - in milliseconds, defaults to 10s
            method: GET
            mappings:
            - field: total_files
              label: Total Files
              format: number
            - field: total_size
              label: Total Size
              format: bytes
            - field: root_folders
              label: Publishers
              format: number
            - field: issues_read
              label: Issues Read
              format: number
```