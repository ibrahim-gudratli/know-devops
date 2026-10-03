resource "aws_ecr_repository" "frontend" {
  name = "know-frontend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "know-devops"
  }
}

resource "aws_ecr_repository" "backend" {
  name = "know-backend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "know-devops"
  }
}
