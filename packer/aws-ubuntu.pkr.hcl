
variable "aws_access_key" {
  type    = string
  default = ""
}

variable "aws_secret_key" {
  type    = string
  default = ""
}

variable "aws_region" {
      type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t2.small"
}



packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8"
      source  = "github.com/hashicorp/amazon"
    }
  }
}


source "amazon-ebs" "ubuntu" {
  ami_name      = "csye6225_${formatdate("YYYY_MM_DD", timestamp())}"
  region        = var.aws_region
  instance_type = var.instance_type
  source_ami_filter {
    filters = {
      virtualization-type = "hvm"
      name                = "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server*"
      root-device-type    = "ebs"
    }
    owners      = ["099720109477"]
    most_recent = true
  }
  ssh_username = "ubuntu"
}

build {
  name    = "packer-webapp"
  sources = ["source.amazon-ebs.ubuntu"]


  provisioner "shell" {
    script = "packer/setup.sh"
  }
  provisioner "shell" {
    script = "packer/usrlogin.sh"
  }

  provisioner "file" {
    source      = "packer/csye6225.service"
    destination = "/tmp/"
  }
  provisioner "shell" {
    script = "packer/boot.sh"
  }
}

