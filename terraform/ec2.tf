resource "aws_key_pair" "know" {
  key_name   = "know-key"
  public_key = file("~/.ssh/id_ed25519.pub")

  tags = {
    Project = "know-devops"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}

resource "aws_instance" "know" {
  ami                    = "ami-0769f265f707fecc8"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.know.id]
  key_name               = aws_key_pair.know.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  tags = {
    Name    = "know-app"
    Project = "know-devops"
  }
}
