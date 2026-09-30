resource "aws_security_group" "know" {
  name        = "know-sg"
  description = "Security group for kNow EC2"
  vpc_id      = aws_vpc.know.id

  ingress {
    description = "SSH from my IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["83.26.254.198/32"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "know-sg"
    Project = "know-devops"
  }
}

resource "aws_security_group" "rds" {
  name        = "know-rds-sg"
  description = "Allow PostgreSQL from kNow EC2 only"
  vpc_id      = aws_vpc.know.id

  ingress {
    description     = "PostgreSQL from kNow EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.know.id]
  }

  tags = {
    Name    = "know-rds-sg"
    Project = "know-devops"
  }
}
