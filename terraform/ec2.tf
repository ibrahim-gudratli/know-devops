resource "aws_key_pair" "know" {
  key_name   = "know-key"
  public_key = file("~/.ssh/id_ed25519.pub")

  tags = {
    Project = "know-devops"
  }
}

resource "aws_instance" "know" {
  ami                    = "ami-0769f265f707fecc8"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.know.id]
  key_name               = aws_key_pair.know.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  root_block_device {
    volume_size = 16
    volume_type = "gp3"
  }

  tags = {
    Name    = "know-app"
    Project = "know-devops"
  }
}