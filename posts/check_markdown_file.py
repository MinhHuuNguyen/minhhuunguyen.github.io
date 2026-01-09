import os
import frontmatter
import pandas as pd


def read_markdown_files(directory):
    markdown_data = []
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md") and file not in ["README.md", "LICENSE.md", "AUTHORS.md", "ICON_LICENSE.md", "COPYING.md"]:
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    post = frontmatter.loads(f.read())
                    metadata = post.metadata
                    metadata["file_path"] = file_path.split('/')[-1]
                    markdown_data.append(metadata)
    
    return pd.DataFrame(markdown_data)  # Convert to pandas DataFrame

# Example usage:
directory_path = "../posts"  # Change this to your target directory
md_df = read_markdown_files(directory_path)
md_df = md_df[['time', 'file_path', 'title']]
md_df['time'] = pd.to_datetime(md_df['time'])
md_df = md_df.sort_values(by='time', ascending=True)
md_df = md_df.reset_index(drop=True)

print(md_df)
print(md_df.columns)
md_df.to_csv('posts.csv')


# 2022-11-11
# 2022-11-14
# 2022-11-18
# 2022-11-21
# 2022-11-28
# 2022-12-02
# 2022-12-05
# 2022-12-09
# 2022-12-12

# 01/10/2023

# 12/05/2023
# 11/24/2023
# 12/08/2023
# 12/12/2023
# 12/15/2023


# 20230405 - Buổi 6
# 20230408
# 20230410 - Buổi 7
# 20230414 - Buổi 8
# 20230417 - Buổi 9
# 20230424 - Buổi 10
# 20230428 - Buổi 11
# [DWDL23A4L1] 20230503 - Buổi 2
# 20230506
# [DWDL23A4L1] 20230508 - Buổi 3
# 20230513
# [DWDL23A4L1] 20230515 - Buổi 5
# 20230520
# [DWDL23A4L1] 20230522 - Buổi 7
# [DWDL23A4L1] 20230529 - Buổi 8
# [DWDL23A4L1] 20230602 - Buổi 9
# [DWDL23A4L1] 20230605 - Buổi 10


# [PROTONX-2] 20240710 - Buổi 14
# [PROTONX-2] 20240708 - Buổi 13
# [PROTONX-2] 20240703 - Buổi 12
# [PROTONX-2] 20240701 - Buổi 11
# [PROTONX-2] 20240626 - Buổi 10
# [PROTONX-2] 20240624 - Buổi 9
# [PROTONX-2] 20240619 - Buổi 8
# [PROTONX-2] 20240617 - Buổi 7
# [PROTONX-2] 20240612 - Buổi 6
# [PROTONX-2] 20240610 - Buổi 5
# [PROTONX-2] 20240605 - Buổi 4
# [PROTONX-2] 20240603 - Buổi 3
# [PROTONX-2] 20240527 - Buổi 2
# [PROTONX-2] 20240522 - Buổi 1

# [PROTONX-1] 20240116 - Buổi 15
# [PROTONX-1] 20240112 - Buổi 14
# [PROTONX-1] 20240109 - Buổi 13
# [PROTONX-1] 20240105 - Buổi 12
# [PROTONX-1] 20240102 - Buổi 11
# [PROTONX-1] 20231229 - Buổi 10
# [PROTONX-1] 20231226 - Buổi 9
# [PROTONX-1] 20231219 - Buổi 8

