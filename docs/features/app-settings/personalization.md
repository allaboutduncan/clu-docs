---
description: Set the site-default theme and dashboard layout, and configure recommendations
---
# Personalization

Set the **site defaults** for the homepage layout and theme, and configure the AI recommendation service, from the Personalization page.

!!! info "These are site defaults, not global settings"
    As of **v6.3**, the theme and dashboard layout you set here are the **default for anyone who hasn't chosen their own**. Any user can override both from [My Account](../users/my-account.md); an account with no override *follows* what you set here, and keeps following it when you change it.

    Only [Store Owners](../users/roles.md) can change the site defaults. Everyone — Readers included — can set their own.

## Theme Selection

![Theme Selection](../../assets/settings/styling.png){: .center-image}

Simply select the theme from the dropdown and click Save. You'll see a preview image of the theme when selected.

The theme you pick becomes the site default. Users who have set their own theme in [My Account](../users/my-account.md#appearance) are unaffected — they've opted out of the default.

!!! info "Saving a site default also clears your own override"
    If you had previously set a personal theme in My Account, saving a site default here **clears that override** so the new default is what you see. Without this, changing the site default would appear to do nothing on your own screen.

!!! note
    The **Default** theme and the **Zephyr** theme are the only officially supported themes.

!!! note "Fixed in v6.3"
    The **(Dark)** suffixes in the theme list are now derived from the actual dark-theme list rather than maintained by hand. *Quartz* was previously labelled `(Dark)` while rendering light.

## Homepage Layout

![Homepage Layout](../../assets/settings/dashboard.png){: .center-image}

### Ordering

Use the up <i class="bi bi-arrow-up"></i> and down <i class="bi bi-arrow-down"></i> arrows to reorder the sections on the homepage.

### Display

Check and uncheck sections you want to display on your homepage.

As with the theme, this is the **site default** layout. Users who have arranged their own dashboard in [My Account](../users/my-account.md#dashboard-layout) keep their arrangement, and saving here clears your own override so the change is visible immediately.

!!! Note
    For an explanation of each section, visit the [Collection](../collection/index.md#sections) page

## Recommendations

![Recommendations](../../assets/settings/recommendations.png){: .center-image}

!!! info "Recommendations stay global"
    Unlike the theme and dashboard layout, the recommendation service is **not** a per-user setting. It gates an owner-configured service holding a **shared API key**, so it is configured once for the whole install rather than per account. See [Per-User Data](../users/personal-data.md#still-shared).

This setting let's you configure an AI-powered recommendation service for your reading list. Requires an API key from your preferred provider.

This feature takes your reading history and "Want to Read" list and uses it to generate personalized recommendations for you. Recommendations are manually triggerer, so you can manage how often they run and use them when you want to find something new to read.

### AI Provider

Select your preferred AI provider from the dropdown. Currently supported providers are:

- OpenAI (ChatGPT)
- Anthropic (Claude)
- Gemini (Google)

### API Key

Enter your API key for the selected provider.

### Model

Select the model you would like to use for recommendations.
