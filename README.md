# beacon
API server for machines to expose their stats.

# Setup

## Linux

```bash
sudo cp beacon.service /etc/systemd/system/
sudo systemctl enable beacon.service
sudo service beacon start
```