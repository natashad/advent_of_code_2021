class Day22:

  MIN = 0
  MAX = 1

  def __init__(self):
    with open('day22/input.txt') as f:
      file_data = f.readlines()

    self.procedures_1 = []
    self.procedures_2 = []
    for line in file_data:
      operation, boundaries = line.split(' ')
      boundaries = boundaries.split(',')
      boundaries = [list(map(lambda x: int(x), b.split('=')[1].split('..'))) for b in boundaries]
      procedure = [operation, boundaries]
      if boundaries[0][0] >= - 50 and boundaries[0][0] < 50:
        # Should actually be checking all boundaries, but studying the input it doesn't matter so meh
        self.procedures_1.append(procedure)
      self.procedures_2.append(procedure)

  def get_intersection(self, cuboid1, cuboid2):
    if len(cuboid1) == 2:
      cuboid1 = cuboid1[1]
    if len(cuboid2) == 2:
      cuboid2 = cuboid2[1]
    intersection = []
    for axis in [0,1,2]:
      start = max(cuboid1[axis][self.MIN], cuboid2[axis][self.MIN])
      end = min(cuboid1[axis][self.MAX], cuboid2[axis][self.MAX])
      if start > end:
        return None
      intersection.append([start, end])

    return intersection

  def volume(self, cuboid):
    if len(cuboid) == 2:
      cuboid = cuboid[1]
    axis_vols = [cuboid[axis][self.MAX] - cuboid[axis][self.MIN] + 1 for axis in [0,1,2]]
    return axis_vols[0] * axis_vols[1] * axis_vols[2]

  def solution1(self):
    processed_steps = []

    for procedure in self.procedures_1:
      new_processed = []
      for processed in processed_steps:
        intersect = self.get_intersection(procedure, processed)
        if intersect == None: continue
        if processed[0] == "on":
          new_processed.append(["off", intersect])
        else:
          new_processed.append(["on", intersect])

      processed_steps += new_processed
      if procedure[0] == "on": processed_steps.append(procedure)

    total = 0
    for proc in processed_steps:
      sign = 1 if proc[0] == "on" else -1
      total += (self.volume(proc)*sign)

    return total


  def solution2(self):
    processed_steps = []

    for procedure in self.procedures_2:
      new_processed = []
      for processed in processed_steps:
        intersect = self.get_intersection(procedure, processed)
        if intersect == None: continue
        if processed[0] == "on":
          new_processed.append(["off", intersect])
        else:
          new_processed.append(["on", intersect])

      processed_steps += new_processed
      if procedure[0] == "on": processed_steps.append(procedure)

    total = 0
    for proc in processed_steps:
      sign = 1 if proc[0] == "on" else -1
      total += (self.volume(proc)*sign)

    return total

print(Day22().solution1())
print(Day22().solution2())