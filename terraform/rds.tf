resource "aws_db_subnet_group" "know" {
  name = "know-db-subnet-group"

  subnet_ids = [
    aws_subnet.private_db_a.id,
    aws_subnet.private_db_b.id
  ]

  tags = {
    Name    = "know-db-subnet-group"
    Project = "know-devops"
  }
}

resource "aws_db_instance" "know" {
  identifier = "know-db"

  engine         = "postgres"
  instance_class = "db.t4g.micro"

  allocated_storage = 20
  storage_type       = "gp3"

  db_name  = "know"
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.know.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = false
  multi_az            = false

  backup_retention_period = 1
  skip_final_snapshot      = true

  tags = {
    Name    = "know-db"
    Project = "know-devops"
  }
}
