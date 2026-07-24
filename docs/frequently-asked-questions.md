---
description: Answers to the most asked questions or things I think you should know
---

# Frequently Asked Questions

??? question "How Can I Recommend a Feature?"
    Join the [CLU Discord Server](https://discord.gg/ndDhpvrgBa) and let me know what you would like to see added. Post all feature requests in the #feature-requests channel.


??? question "How Can I Report a Bug?"
    The best way is to [submit an Issue via github](https://github.com/allaboutduncan/comic-utils/issues) and label it as an **enhancement** or **bug** when submitted.

    You can also join the [CLU Discord Server](https://discord.gg/ndDhpvrgBa) and post it in the **#bug-reports** channel.

??? question "How Can I Say Thank You?"
    If you enjoyed this, want to say thanks or want to encourage updates and enhancements, feel free to [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/allaboutduncan)

??? question "I get \"Illegal seek\" or CBZ write errors on a mergerfs / FUSE mount"
    This is fixed as of **v6.0**. If your library or `/data` lives on a mergerfs, network, or other FUSE mount, older builds could fail zip writes with `OSError: [Errno 29] Illegal seek`. CLU now assembles every zip write on a local seekable volume and moves the finished file into place, so these failures are gone. Those writes also get consistent parent-folder permissions as a bonus. If you're still seeing the error, update to v6.0 or later.
