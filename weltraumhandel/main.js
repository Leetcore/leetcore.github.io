var planeten = [
    {name: "Händler", bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADGUlEQVR4Xu2bQW7UMBSGPdwCJNqzsGfBEViDxBJVHAAhVgiJNRyBBXvOQivBLRg0IqQhM27+5yR/nfHXbV/87O/zsz2eyS7xVxWBXVW9oTMJIZVNAoQgpDIClXWHCkFIZQQq6w4VgpDKCFTWnaIKef/tzb6ycVi68/rp2yJekc4VJUBIBHEsFiEBXlRIAJYjdBNCfl7/crCoIseHF5+LVpRI54sSDPcQhERwT8ciZJpRH0GFBGC5Q9eSQ4UUmkRIIbi1HtuckI8vv4RYvPr0/L/46PO5ZMN21TbHfTnVNkJCem+DEdKxUGfjP3RUyF8SbOqFlZd7bO5ShhCELEygsuY2USHD/UQ5wYwZz9mP7nq2pC9T/hFygpB6skJISqkEAhUyUZet3vZOLVeH/29iyVIGci4xCKnMZLVCcuv+3A1XObGpe06uLyX7nDIvHl087MNyXwev9sEQIceKEDIxbZuqEKWEW4u51wppDbYyXoQolIwxCDHCVlKtJuTBbtf/2Pri8aXSF2JSStc3P3oOv/f7kyfcomMvQsrmF0LKuK32lF3Is6snocF8ffc9G79UW9F2Dh3K9WtuWwhJKc2FOJwxc9tCCEJYssZr8HD5o0KoECqECukIrHUyYlPvCERPNAjpwA2vTpaCeGh6qbai7fA5JPPRMAqSCqFCpFsJjr0jTNFK2/ySlbtGlqZPY0HDW/LVrt8Ros8qhOisLJEIsWDWkyBEZ2WJRIgFs54EITorSyRCLJj1JAjRWVkiEWLBrCdBiM7KEokQC2Y9CUJ0VpZIhFgw60kQorOyRCLEgllPYhHCd+p3C+EbwxGf5r4xpEKokJME+NVJh4UKoUKokDGB3DuG0Q2UN6iO59aiL30i5Bgwx16OvbfvqVMhVEhPgGMvx17pEute9xCphw0H2V/6bJi1NHSESJh8QRYhvuGcV6bVXkc4L0y+0SDEx1rKhBAJky9oUSG+breXqehysT1MvhEjxMdayoQQCZMvCCE+1lImhEiYfEEI8bGWMiFEwuQLQoiPtZQJIRImXxBCfKylTAiRMPmC/gBDJKSSel+vpQAAAABJRU5ErkJggg=="},
    {name: "Tanke", bild: "data:image/png;base64,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"},
    {name: "Werkstatt", bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAEW0lEQVR4Xu2dz2oUQRDGJygmQoh7CSwiGk3OkouI4MGzZ/Et1AfQuycPgi9hniAPIHjwYDwoCDlEUVjwXwhBE4lENmt6KpuZ3W+mq8vqzZfTZlNd3f39uqr/TDOZKvjjSoEpV61hYwoCcTYICIRAnCngrDmMkEkAcuXOk/3Dfuz9+FDZpd9bvfD97IXl8PnXl/Xw+ez8Uvi8/WntiB/5N1nm3OLNyjLy++/vVoPN0xvV7Yvl0NvcKfs3c7ps087eEdfdzszYqtZ728GmVYQQSFEQyL8xxAipCLi6CJFpamycZmhgkf5UUxaBtBtlMv0RSAMNGSENxLIwzQLI/s9vlUtaC4Gs60gFRPYjOmURiO6wIJAGemYRIbu9t6FLf3bLHWeDfh6Yyt14/3e5U5e+5EruzFy3shrEZrhgXdtPTc8m3/Wr7tQJpOnQO25PIBUaZh0hyJjoXrsbDiDrcu+Dl5eCq96rlVbzGdIWS5vn96+HfrepN5kIBNIGR5HuES6BEEg7BRKXQlLYi/dfQyuYsgikVGASJ/VhvhMZIXI+Qga0pxUbAiT6LAsRRXNSJxBE8TE2BDIQyE2EzF+9HTZIz26VR/SSo5xDRvGVG8ttcatjVtz28DofEUhRFJxDKoY3I8Rxynq0/DkgQy6OoVOYTF8PXy+6PBdDUlb0aS8imIwQAhmtGIEgI0rJxk2EIMtepT4fuMl5lRV9LwsRkkDwSZ1AkBGlZIOkLAJREhtxQyDcGFaPE84h+Bzi5rQXCXnUJudVljkQVNQ6u3uXy8t4S93y4lrdQSXPsiqUbPoMYxQ0Aokd0kVREIizOUSBaXkgKS7dIX6ZshCVImyaRhuBRIiNFCUQRCXaQAogO3WT43eotSfAiECcQXYJZOHiQtQV/c5cJ8i8ubXpQvKNjxvQNVwEiMlOXVZCIPgYgijj7qotCQRXUBUIIvzMdPm6op3d8hVHw032mKbqZB2VvpCUlewBFYEcR0YgeHZQs8w6QtRUcOQoFsjaRrlyNJ9DHOmo1hQCUZNSxxGB6OgIeZGrPbkqlJ9jgSTbGCKrLEgFR0YE4ghGvykEQiB6CsiUldNOO1aB2DnEZNlLIAPMyE6dQGJDYqh8FhFS1+fcIgc5DI0F8l+XvQQyOjzNj04IxBCIrEpzk+gRouYj3GTPQwjE2fMQAnEMRHllma07ZB9ikrKyVVC54QSiLGisOwKJVVC5PAIk2cZQuS8T4Y5AnGE0ASL/Kdjj8yvOJMivOatvyv/52OrohEB0oROIrp7R3ggkWsJ0Dpiy0mnbyjOBtJItXSECSact7JlzCCyVjSGB2OgM10IgsFQ2hsmA1L2XXZ73yxcp130/LANih9jI9vXrkO+Ol3Ui/ZA2da+M6vuULwWQdsNtOaxfdVJHOkIgA+kJpEKEiYkQm8x6MmtplbJOplQ2vSYQG53hWggElsrGkEBsdIZrIRBYKhtDArHRGa6FQGCpbAwJxEZnuJa/LOL7vUu2d0MAAAAASUVORK5CYII="},
    {name: "Neptun", bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADiElEQVR4Xu2cTY7WMAyGO2LNjp8dJ5gLsEBCSGyQOAqn4ShIbJAQEgsu8J2AHTB3AMFUTFWaxo4dxy3PLEeO67xP/CZfvs5cTfykUuAqVTUUMwEk2SIACECSKZCsHDoEIMkUSFYOHQKQZAokKydNh7x88fCnlzYfPv5IMy/tnNIUDpBbdADRLuHO8QDpLLA2fTiQkjV5+n7EM7RCS+MBIlUqKA4gQUJLH9MNSEbb2DvJeVqmVPytOIDMqgDEsowax/53HbKccJYVJ2WXpXZXy8oyKSmEZVyW2gEyUzkNkCwTaemK0piRczJ3yMjiPSFksS+AbFAduciagIwsuFdXZLEvgFQIRy8+gAAk2nRsz6NDbPq5jwaIu6S2hCmBrC/lvO6pHl2/Eb1pcv3qU1XVy/vnmzHfL2+b9smtZBFwRMUC5BYPQOZlSoes+tXaIVJrKvmSBcgyp9W+TtMhAKlugX8DQvYQgACky4nr0JZl7Yqlok+ffK4usS9fn1Vj9gIk+wtAZgUB4nDKokPaGra4qbe0ZwnCg8fvNqu7+fa6rerOo0baF0A24AKk84rXpgeIVrHO8QDpLLA2PUC0inWOPz2Qzvq5pweIu6S2hACx6ec+GiDOkkquWtaPXN6FAQQg9e9DPK9OnPWupqNDZok8LxSrqk/TJPlq9/7lniTVhGWJZNoPAkhFRDrEvspCbnvtZd5lkHTF8nl7llX6lpFTloIYQKZpkr46GmFZAEkARAuhxbIkNrXM2/KxQGIEh9hDANL4YnEvywIIQKruEm5ZJb/8/fvSJj+yQ0p/H1JVdg6Q7CG9ICxrdH23FyBS/OU4gJy5Q5bce3WLfQ3eZZDYVMRRt5tlAcS+XFwtCyCJgZRKi7YyrS3tSXq4U5ZkfQBkX6VulkWHSJbnvzEiIOthEa3bNh3/UdFzBUiFIUD8F7kpI0BM8vkPBoi/pqaMADHJ5z/4EECi73f8Zd7PGA1BfZc1+tMrQBQKjFxNijJVoSPn1PQ5pDS7kRNRKb4RnKV2gMxwAGJd0s7jTwmkdPpa/l76FqSz3n/Srf8zXpa6XE9Zkv0ky8QBskGLDtnvfddNHcuyG203ICOtrGRNI7tTigogUqWC4gASJLT0MeFAtFYmnUiWk1xLvSHHXm1he0dSba4j7BWlOdEhWtqd49MA6TzPw6QHSDJUAAFIMgWSlUOHACSZAsnK+QUgbZqS3rBh1gAAAABJRU5ErkJggg=="},
    {name: "Pluto", bild: "data:image/png;base64,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"},
    {name: "Sedna", bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAEmUlEQVR4Xu2dTWsUQRCGZyF+LYkRswY0EkyMoHtRkoAe1JuYq2dPHsQf4tkf4B/w7FXwInjIwUBA0YCSQzCXuJcoRET8IOymt2ayPameru6u2X1zWrLVPT3v01Vd/TGzjQx/qhRoqGoNGpMBiLJOUAsg929c+XegW+t000i48bVjPtP/U41frX+uxT0etLkWjQUQZW4MIMqAPLjZNiFr69uuaV3zxDHzee/Xb+dWawxztQhZAOLc18IWAJCw+rJqp+NG5/seq8xRRmub2zmTpfmZo4rkvl/b3A4eUYJfwOmOiTGAVFUuUDkACSRs1WoBpKpyjuWW5mdMCutYNJo5HWvoOEPT7PbkmGnP89UvYqFfrCKuWgBSrhSADNBn6D2kDl7B9fADu6sXW6bI/PE/5vPT1x+8OrlXYe5NAAhXqSzOfgiAKAAyjBCorHT1YGVhynw1PX4yp75rCAsWsgCkywVA+NHBy7IWHjLsXmEjODXWz7Lmzo7nzFwnjaIhC0CyDEC8Ao9MYVUe8uTWglmberfzU+YOmbXQLVipPRPmpXNmy9OnrMWihywAyTIA6fVHeMgAx7xz7ZIJWXR5OmUIoSdQaJuqhCNOGVUeAiDKQhaAKABC5xuz5yaNV9NDbBxX9z3oxrlGDJvkIQtA8pgBJEa3d7hGdCB0rrHfzr8TZwaGqZSZlU2/sjO/UhkYgDj0XgBxECuGKYDEUNnhGiMBJPYiooP+SUyTjyEAkjjtLWZZAJIYyKjuBBbjn21lIXrIApAuGgBJMkTbL6oGyON7y7lHCOgD+5ynX+kM3vbkqzLtnZoTPWQBSDkfAHHqv+GNowORHNR9t1e17KNTzADSU0PL6jKAjCIQule+ePl8LhC//bgVPjArv0KZV9Cmix2UA5DqmRWAJPCm6B7y8O51MxmkE8EE9y52yWIS4DNJBRABLAAiIKJkFbUG8uzRiglZL968l9RlKOqyhSzXrKoohvUJKgCplmUBSCJ/i+4hIV6PlEg7sctyMqtgHgIghzkCiFjflqkIQGR0FKtFLZDb7Vlzkz4Ljb57G757K66kAOQIxQCkJxA8xN5TgmVZdHGxuORAgbxc3XD1fDH7GB4SI0xRQawzdQDpygQgDv4zUh5CdwyLh+GG5elZDns1HgIgykIWgCgDQg/H0XfU7jeTviCAc7aXExo02XDCFG2vb6rLyrIAhN9FAISvVSVLlR5C5yHFsOT6TpNKqjAK+a6F2S7BASLpFayQBSDlPQJABugzUh5CDzkU16u0vDmOEdUqmYTaL+c0hnXqBEC6UoYKU6wxBB5yuD8nBUJn6sWmjepkEEA4QVfIJmWqywpZ8BBlIYs2p+yhzzo9g87xgiKGGGGK5SEAEi+zAhCHcQce4iCWq+nQhizbXrbkeGJLrTs/+j/lPdvqv8TZZ6Ew9bjhHbIAxNU3+fasnzwqZlkAwhfY1ZIFpKxSCov+hmyj0a96ce7CwCoo2LKTLXQxc6uza+pqTTTN50/bO9734ipeCHvvmwAQWSwAIqund23eQLxbgApyCgCIsg4BIACiTAFlzYGHAIgyBZQ15z+pvHGSUUx9KwAAAABJRU5ErkJggg=="},
    {name: "Xena", bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAF7ElEQVR4Xu2dvWsUQRjGLzY5m3gWiRcSzgsxXwoSsDASvwKiCDaCnTaKjWChhdgIQUgTLEwh2Ig2ik3AQisbBVP4J5yCJCbNRZszTRIb5bi73Xc38+6+szO7N8c9VudmZnbm+c377MzczF5PDv+cUqDHqdqgMjkAcawTOAPkzu3r/yTa5PO9ymQ7O7vK689fvHGmjZL2OVNZAGngAhBJt80wTeZApJHAaSCxrFpty8tOraxQ6AsUy5XVTpsDEAV5ANGwBESIhlg0KWdNnKADg4cDd+orFJR33qrVvOvrq9+VaSqVH0rLmpwcFVlWsdjvpZtfWMrURVK7GYAk68kAotANEZLL5WBZluYhusNY6TOk/1BRGfO/N6vK6/R5Uq3+VqahPT/KULh0tNy0RmLGlgUgyZ4VXC4AiXmG0D87GyG6UVEuD3vtGiof9T5v/Fxju5eJZdnts/Gl2bSvRBECIEFIAKLotNwkMb5/m6foCCB0NDV7/hKZOe+ILEsyU6dSpgWELlTSz3Shkn42hZOaZQFIssgDkBjdOjpCaFQcmz7pNXV317cpujiYrA/5udKyKVovXSDhr5JfvV7W6vRaiVsVlSwcAkhDLQAxDbtQficjRDrvGJs67jVne8e3qV3yeX8+b02yLCxLt7IUYDjv2+X3sY4Um6BeKIDIsQCIXKtMUrYFSHj3RqulfQf9JfNa7Y9SgELhgJEwLtoUbRC3Ya+eho5CuQlkIssCEL5PAYhRvNnP3HYgwyOTXqtsTvpM1qmoNdDPYbGixLOPKlhiapYFIMnQAUgul+voCFlceOgdDwgP5ej/SyPjybpITC6T0ZRNy+KGsdzAJqpZnEXS5RV2lAUgDWkBpNnFECGhWEOEOBYhS0/mvWfI5uavAC7XnyE2H2pRSyGq+0Q9W4yeIQASHSEcdACxGQ6KstoaIffv3lKehA2HWlpDXZPZecpc9hSfZPTF7RmmZ1ACw14AkWMFELlWmaTMHMj4+JjXMLprpH5x++8+K43uJV/nbqx+C5TZzoU/K41TFEL3ONM/P3y06DkVa1kAYh8LgNjX1KhEIyCzs2e8m5dG/SME9YsrXz77dkZ2lOjWttssa2LiiFKiew8ex1sWgOh2r/j0ABKvUaYptIHQ/Vd0EnNiZi5Q8WrVP3jJHcLUbanJ6q7uvVrpkwxdk96rng9AYtQDkAiBECENcQLzEM6yjk2fCki5Sc6K29ppYgqEm0hy5+LrDco6Qri6PH32Uj3KApBGv0vyfbnk2QIgoe2bYdE6NkKGylOBttgaWdmcGCaxLEmvziIN3aMleoYASLpYACRdfbVLFwGhpUZ9Q0iPHXAvnMwzp6ZsWpa2Cm3IQN90R2//aeVr/CgLQOwTAxD7mhqVCCBG8tnP7DwQ2mTTmbp9+faWaDq0BhDLlADEsqCmxXUEENNGtvJ3g2VRrUQnqLgXBGCnYkNK0wgBEFvh2ywncyC0/pcvnPP2+ZZGgrslyuWS5abuLa4TLMxEBJFlAYiJxHp5AURPr9RTawOhNZo7PRM4pnB2LrgLRVV7bkHRtKWuWxn3mvN6u+lOHgAx7QnC/AAiFCqrZJkAuXnjGvsbgwOD6hGX6WuYdAV0xcrCQN59+Ch641KrvaLEACLvHgDS1KqrIiTqnYt09loa8U9dcaOsajV45r3V94rFAXk3VKTMGoj0R2N0Xz0usiwA2dsDACQmfroqQsJacBFDew21L2pHa2vrSmltro9lAYeLEN1RVVgMkWUBiNyyAKRND3inIoSz86tXLionkHQNR3dUlmToRS1L+pbQJPdp5dEdSUXdK5FlAUhQAQDRGHEhQhRiwbLkhmjVsrjb0mEyPSTDbc6ul0NPG9FNFnRzd6Xi/3w3Xcz8u73lVSXqHlx9Je9ol0uslxJAFHoBiOJcHyJEL7Kspw4v8XMHJKnl0b2y9KAm9+a28GFOame6vxVlXYBmgZlYlqTyANJQCUCavQURIgmbLkzjTIR0ofbKJgOIYz0BQADEMQUcqw4ixDEg/wHLKYmw3V3SfwAAAABJRU5ErkJggg=="},
    {name: "Jupiter", bild: "data:image/png;base64,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"},
    {name: "Merkur", bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAD0klEQVR4Xu2dO3bbMBBF7Sqtl+AmjSvvwZ0br9WNu+zBlZs0WYLbVMmRzDAQRIBvAHA0km7qITB8d+bhI/rk9oZ/oRS4DZUNydwAJFgRAAQgwRQIlg4dApBgCgRLhw4BSDAFgqVDhwAkmALB0qFDABJMgWDp0CEACaZAsHToEIA0KfCn6anjh8IXYPgEJ00BMqgiRw0DkFFKDhpnFJA8nXAOES6hAkCADKrsUcMAZJSSK+MME/rh6X415Y8fv7AsgKzWyUHAqdcQOiTj5Q7k4em+C8KC7exfSbGsWq1m47rr8i8394kBUrcwgEz6XGSH9Fa/svw5WVaaimvRDp0MIEpJOVoWQPyASDsjZafz/dudlPXP35+LcYplpXOUxjHsuEqhQ93FussCyDEWgOw0ueYOmbtCsaK8gBRrGmknaY7K3Lt8lflLBVCxvK7OqT0MkEpHAmT5ADfrQoes7JUU21AsI5/GuobU0lTmPwvLKomtvGBJoIYXPxhKWefyvK35NuZoWlOa1hCASEcp69FiHw8Qg7ZhO8TwDvvQ9EVenh/nx1/f3q1DFeMVy+qdrBFIOu2qfTV1iPXFADIrBhBr8Qy446oN0QUkHbh4l6VYRUuHpNaWJlKyOSWPkXAad4sA8YCQzrGyzgDkIoG8PD8eWFZqG4pVXIplKb+zuHQIQL76DCALfnPKRf3UQGabKu14cr2sB73aIdF6gFSss3aXpYitXBltaVkAySoOIJMgSuddVYdstXW02lItjxYg6XjWq/iSxblYFkCOFQDISlVcQ4fMEuTnEOVuSemq2u5NWTfSOQBiWHBLcAByrMzqZdfuETok2BqS24FyiFJuQL13WYqN9sa47LIAomMCyKSVsqjrsrZHAgQg2jW0dQ1RLypLOzPrSbu9B46f7O2KdMSmr062WNQB8qUAQAa0Ch0yiehtU+KHctLZrlQHZ90hAJmwRllDrg1I2lXSH30qdmz9AC4fM31+KyAe1tRiWQCpV1jXWgEQpX2nmLPrkNKloPp1ikGbfWj628hIyyp9tPD69r5J9SvvrU58sIYARJG2LQYgC7qdQ4fUcDfvwLayOLU2s5+J1eJUh2+KG5EEQJqkX34IIP91GaFFNxqvJBY/Sy3tnvKdVfdbagN4aVHNxisJgGhF4fa/RQMkGBAxHcK8LAulRQUAIgrlFQYQL6XFeQAiCuUVBhAvpcV5ACIK5RUGEC+lxXkAIgrlFQYQL6XFeQAiCuUVBhAvpcV5ACIK5RUGEC+lxXkAIgrlFQYQL6XFeQAiCuUVBhAvpcV5ACIK5RX2F14Xz4OG4YCpAAAAAElFTkSuQmCC"},
    {name: "Saturn", bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAEgElEQVR4Xu1cMWgUQRTdQDDRnBxEkoAHSgrBRrBLbWFjYaeFjWKpiJViaydaib0o2GmVVoigYLo02hlIFdGIwcOLCSGgnHuZvMzt3/2ze7f39+6lWvZm/v59b96bPzNLxiL+mUJgzFQ2TCYiIcYGAQkhIcYQMJYOFUJCjCFgLB0qhIQYQ8BYOlQICTGGgLF0qBASYgwBY+lQISTEGALG0qFCSIgxBIylQ4WQEGMIGEuHCiEhxhAwlg4VQkKMIWAsHSqEhBhDwFg6VAgJMYaAsXSoEBJygMDrpxf/SnicmDmZ+NPPH18zIbxy921lB9pAEych3WOLhGTqrdwGpRCCSpg6Ou7ecPzIVOJ1+yZaE/aZrM26Phr7ygPnIC2PhCQwRkKiKEK1UCF5dJ3RB22qXq8ntkb7wet249bmmuuzt7uVeI1Bh8XK+mZZJCTfKCchAbiVMbeQkKoQ8vL5M3EVLb3Dsd+L7idcaeOEjV6/09pQwYHzidRha3tPFQsbYTkd2r9fahEVQkLS+SUhGeM/dIS3w1VWIddv3hGVhNVUY/58Ynk6e2rB3f+0/CoRWn8zEUvdZrPp+mAJjfeD/apgh4EqhIR0s0dCOpiMlEJwIk9TBY6Xj4v3XDWGNoOVUW16PnOl7W8Uor/j83CuKIOcucYZ9/jv61/cdSkKISHd1kRCOphQIVEU5VHIytITZ1nfVpfcEMMFoFQx4Xj0NyBDKyiphC1qa1Jcs5ZFQgrWz173Q+sLKqQb3Mop5P2bW86ypD0n//Bp/7XRyvKstHs7NpOjYV4bmzuu0f3Hy33ZmC2sEBLS22FBQgL2yEpXCOamnU+kb6vK/lIE98JwWz+PFUp98P7thx/6b1kkJEaAhPTAhkdKIT5euM8lWRYCVPSDtiLnFpi7v/rXKEHqX8rCULIsEhIjgISSkM6oyDNJ7w+oSitEqxZshx859GBa6EkI3MvChag/eWNJi8Th9Z/jlxNz0h5VaF5IVbppP3ggIRrI09uQkA4+VEjxwaSKMJSWlfbmGjuzaGX+O0nFglRZSe9ddD5RWRYJiRHAUpeEqAwqf6OhUQhCIK3apXIxrWTWTLL54Y974jNmpyddOOm+tBhMs+1QCytsWSTk8LcI/iAhIQGyGXqFSFi8eHTBHfNqVr5+HKzSPq/+cj9jrPlGLYCKuCnOG9IG5o0H74JcxLevgSqEhHTbFwkJ0MnIKkSjHL/srJ2+mgktWhnOB9hR2ij0qyzsU+R4thKWRUIyx5ZrEDRh6cPqWuJkT4XEmA2UkLQ1jOYgard+yYWYmDhY2KGVSR+6xZa17fovnJtx10VOAyttWSSk20mokA4mVIhumvnfKu0fne2HWVtvuYhzZ6+pomuOBXAfTlpTaD8q1CRlRiFpyZIQDZUltiEhJYI9yEdpTjs1+YVuj6TFrIRlaUDJ04aE5EGtj31ISB/BHZbQI21ZFkkkIcZYISEkxBgCxtKhQkiIMQSMpUOFkBBjCBhLhwohIcYQMJYOFUJCjCFgLB0qhIQYQ8BYOlSIMUL+AV4b9ZLdBPoTAAAAAElFTkSuQmCC"}
]

var waren = [
    {name: "Bananen", sound: "bananen.ogg", verkauf: 50, bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA4UlEQVRoQ+2V0Q2CQBBEoThpwvpsQovDkEhyXjDLTjIGlsfvMQvzHneMQ5FrLNJjoMjRTGIEIyYCfFomsPJYjMjoTEGMmMDKY69p5Pm6zz2y6fb4gtHe068t2T0zFC0pI3te4hRFVlJ9oZZ8VDZaV2wsmZSR9iEZ8tEntrWeLUSRyEi7sU9thCLZzfG5nz0S7ZFf62WO30MVKfNDvFyRf/w/1kNOPrXEU9IWo4gNrTgYIyI4WwwjNrTiYIyI4GwxjNjQioMxIoKzxTBiQysOxogIzhbDiA2tOBgjIjhbrIyRNyl9qDOEalLOAAAAAElFTkSuQmCC"},
    {name: "Alien-Eier", sound: "krieier.ogg", verkauf: 60, bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABj0lEQVRoQ+2WP0sDQRDFN4VNLGxSB7+ItY2NrbW1dRoR8ROIiJWFlYVYJIIWWgiHJIV/ICCksPEEFXJNmmssVmZljyVeLO7NBG+ZLe9u5va935vba5hIViMSHUaF/DeSSkSJCDmg0RIytnJbJVLZOqFCJSJkbOW2SqTMuoPVI9tqttytUTYyu8n23IxifVHthZyun1mikE5Sk3/lBazaETnf6DohtIZvw1+pm4cglmhFIeR47cRmeVZQCKPlL9aCSG/z0o4/x27PNCNlKxSys7LnYsgtDo5WNEJuOrc2uUsqncicVGAiV1vXdvA0qCSEc4ZUiHeTPr1lZ0eIyEfID/o0Po6IwUSiETLLZXL98ePemX/x0nWGhc+mk1fTXFh09w8f9mFD4QazhNAhOb1BepYE/PwdP5v+ex9+v48p3CgaIWFkKErtpeVilv+KDBnAMeRsRKADhLEYjhbjXqBWKgSyT6BYiQiYCrVUIpB9AsVKRMBUqKUSgewTKFYiAqZCLZUIZJ9AsRIRMBVqGQ2Rb3AOsjOtlXVSAAAAAElFTkSuQmCC"},
    {name: "Pony", sound: "pony.ogg", verkauf: 110, bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACBklEQVRoQ2NkGCaAcZj4g2HUI4MtJkdjZDRGaBQCo0mLRgFLtrGjMUJ20NFI42iM0ChgyTZ20MRIs23pf5Avag93k+UmsjSRHWw4NII8oSerDZa99PgqmCbVQ6MeoXasLJw3GZy0YODR/EcMIlxCcH7mzkq8gT6gMQLLFxoiKgzffH+hhM23lV8Y3nx7BxcjlNRGPYIracFCmVCG7XWqgyelb7+/E0ypdIkRmOO5WDkZjM1MwI66fv4qPI2Hrk8HxzyyJ0HJ6cabOwQ9QChAYAZQJWkNG49Md2+HJxPkDEpUcKMpIpSEcJlJcYyAPIGcxolJ7yDHyPFLMzz6+JSsyg+bZ0Y9AguV3Xlr/l+6cgnMxRUboEIAnzxIX/uJKRQFKkWaQY4bNh5BLlLJydwgPaACYuLZuRQFKkWa0esGZI8glz6EPHvtzR2G5dfXU+QWijQPO4/A6g5CySPfOPk/LOPDaFBggFq5hFq3hJItVWLkIbQ+mHNpGUHzQJ6BOR7mOFCdEr+lgKBefJ6hSDMsaQ0bj8DqD2LqgkqLHHCMDMqkBSp1QICUkgeUxJB7gOS2sajW+gUVrcPGI7BQISVUYZkepJdQaUeoxALJUyWzDwuPEBNa9FBDcYzQw5HE2DHqEWJCiZ5qRmOEnqFNjF2jMUJMKNFTzWiM0DO0ibFrNEaICSV6qgEACF0IQk2DWOAAAAAASUVORK5CYII="},
    {name: "Bionic-Arm", sound: "bionicarm.ogg", verkauf: 150, bild: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACIElEQVRoQ+1Wv0tCURS+DoJBghCkq2s/QChobq2mtkalIfsHzDYbMh0SazAbFBtyUxReTlGjRoMOb7EiiwbtBwhlOGXcE/ciYgr3eCFe1+We947nu+f7vvsux0QM8jMZhAdRRP6ak8oR5YgkBdTRkiSsMKxyRFg6SYXKEUnCCsMqR47j8Q6Tz2KxcCVrtRrE5s9X/s4fOpQumPAGhiHC5D5JpTrtdhsemRs0tn59cEf0mzuI52amSf3lGeLbhycyPzsF8SgcE3bkIBqFo+VyuUixWORNN5tNHi+/ZSDWJlZh9Vh1knifhpgex3K5DHEmmxXug20mDGAYIv3uyW2/n18ANO9wOOBvS61zWK+da6RarfJSdiSpM2eFgrCoFBBV3I8Me0dJrU8+wuOVYwXWxfEGuWz9kKtUKsTuLEFcurCT03Qa1Quq+F8QGUSS5rqPIT1i+5EISlRU8bBmh+WPYjH4pja8XnQfaIBhzQ7KG4bIls8HjuyFQmhB0QAYRwxBhM5qmqaBDrl8Hi0oGkDUEXpr6bquiPQKOHJHdgIB+IDpUMgGyN1gkO+z6fXyvNlshn5C4TC6DzRArzJsmOyM5UjjfgHSNpsN1nq9zkf9UUy83XsrIr995Gz0oOozJ9j44XG7O4lkcuTi0V6kgIreZJg6RQSjnoxa5YgMVTGYyhGMejJqlSMyVMVgKkcw6smoVY7IUBWDqRzBqCej1jCOfANuY9kzxF/egwAAAABJRU5ErkJggg=="}
]

var geld = 80
var verbrauchswert = 0

var raumschiff = {
    name: "Transporter",
    geschwindigkeit: 10000,
    reichweite: 50
}

function init() {
    erstelleSchiff()
    $("body").append("<div id='stats'></div>")
    $("body").append("<div id='nachricht'></div>")
    $("#stats").append("Raumschiff: <span id='raumschiffname'></span><br/>")
    $("#stats").append("Geld: <span id='geld'></span>T<br/>")
    $("#stats").append("Reichweite: <span id='reichweite'></span>")
    generierePlanet(Math.round(window.innerWidth / 12) + Math.round(window.innerHeight / 12))
    renderStuff()
    randomEvents()
    verbrauch()
    setTimeout(polizei, 2000)
    nachricht("Du bist ein Schmuggler und willst dir eine goldene Nase verdienen. Pass dabei auf die Kontrolldrohnen auf, wenn du eine Ladung hast!")
}

function generierePlanet (anzahl) {
    for (var x = 0; x < anzahl; x++) {        
        setTimeout (function () {
            var zufall = randomNumberGen(0, planeten.length - 1);
            $("body").append("<div class='planet' style='top: "+ randomNumberGen(100, window.innerHeight * 4) +"; left: "+ randomNumberGen(100, window.innerWidth * 4) +"; background-image: url("+ planeten[zufall].bild +");' data-name='"+ planeten[zufall].name +"'></div")},
            randomNumberGen(200, 500))
    }
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function renderStuff() {
    var ladung = ""
    if ($("#deinSchiff").attr("data-ladung") !== "" && $("#deinSchiff").attr("data-ladung") !== undefined) {
        ladung = $("#deinSchiff").attr("data-ladung") 
    }
    $("#raumschiffname").text(raumschiff.name + " " + ladung)
    $("#geld").text(geld)
    $("#reichweite").text(raumschiff.reichweite)
    setTimeout(renderStuff, 1000)
}

function randomEvents() {
    // angebot erscheint
    for (var x = 0; x < 3; x++) {
        var zufall = randomNumberGen(0, $(".planet").length - 1)
        if (($(".planet").eq(zufall).attr("data-waren") == "" || $(".planet").eq(zufall).attr("data-waren") == undefined) && $(".planet").eq(zufall).attr("data-name") !== "Händler" && $(".planet").eq(zufall).attr("data-name") !== "Tanke" && $(".planet").eq(zufall).attr("data-name") !== "Werkstatt") {
            var warenzufall = randomNumberGen(0, waren.length - 1)
            $(".planet").eq(zufall).attr("data-waren", waren[warenzufall].name)
            $(".planet").eq(zufall).append("<div class=\"waren\" style=\"background-image: url("+ waren[warenzufall].bild +")\"></div>")    
            // nachricht("Waren gefunden.")
            setTimeout(function () {
                $(".planet").eq(zufall).attr("data-waren", "")
                $(".planet").eq(zufall).find(".waren").remove()
            }, randomNumberGen(30000, 60000))
        } else if ($(".planet").eq(zufall).attr("data-name") == "Werkstatt") {
            $(".planet").eq(zufall).find(".waren").remove() 
            $(".planet").eq(zufall).attr("data-waren", "Booster")
            $(".planet").eq(zufall).append("<div class=\"waren\" style=\"background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAABJ0lEQVRYR2NkGOSAcZC7j2HUgZTG0GgIjoYgpSFAqf7RNDgagpSGAKX6R9PggIbgtXDj/7++fwe74fPvvwySymoMz+/egrsJxP/y6C4Dp7AYw/e3r+DqbLffJDrmiFaIHBL3y6P+P7l0luzAGXXgoA9BWNwe9lT/f/PjDzBXnZ8DI8rPvPnKIMXFyvD59z+4HEgdzaMYW+IDORYmjs0BMHlSHAcyj6xMMmQcCCpmYI59++kL3N3CfDxgNqwIAhUzf799BouB1JESihSF4KB14MOm9P+Pjh8YvOXgoHcgcjHz7NsvMFeKiw1Mg4odUNECq/5g4sjq6JYGyY5jEjRSlElIsIdspaMOJDvooBpHQ3A0BCkNAUr1j6bB0RCkNAQo1T+aBikNQQCsiIYpMF2WVQAAAABJRU5ErkJggg==')\"></div>")    
            // nachricht("Eine Werkstatt hat einen Booster im Angebot")
            setTimeout(function () {
                $(".planet").eq(zufall).attr("data-waren", "")
                $(".planet").eq(zufall).find(".waren").remove()
            }, randomNumberGen(20000, 30000))
        }
        if ($(".planet").length > 0) {
            var zufall2 = randomNumberGen(0, $(".planet").length - 1)
            $(".planet").eq(zufall2).velocity({
                left: "+=" + randomNumberGen(-200, 200),
                top: "+=" + randomNumberGen(-200, 200),
            }, {
                duration: 20000
            }) 
        }
    }
    setTimeout(randomEvents, 10000)  
}

function erstelleSchiff () {
    $("body").append("<div id='deinSchiff' data-name='"+ raumschiff.name +"'></div>")
    $("#deinSchiff").velocity({        
        left: 100,
        top: 100,
    }, {
        duration: raumschiff.geschwindigkeit - 10000
    })
    scrolleBild($("#deinSchiff"))
    SchiffinMitte()
}

function scrolleBild (element) {
    $("body").animate({
        scrollTop: parseInt($(element).css("top")) - window.innerHeight / 2 + 25,
        scrollLeft: parseInt($(element).css("left")) - window.innerWidth / 2 + 25
    }, {
        queue: false,
        duration: 2000
    });
}

function nachricht (text) {
    $("div#nachricht").append("<p>" + text + "</p>")
    if ($("div#nachricht p").length > 5) {
        $("div#nachricht p").eq(0).remove()
    }
}

function SchiffinMitte() {
    scrolleBild($("#deinSchiff"))
    setTimeout(SchiffinMitte, 2000)
}

function verbrauch () {
    raumschiff.reichweite = raumschiff.reichweite - Math.round(verbrauchswert * 0.25)
    if (raumschiff.reichweite <= 10) {
        nachricht("Du solltest dein Raumschiff tanken.")
    }
    verbrauchswert = 0
    setTimeout(verbrauch, 30000)
}

function polizei() {
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")
    $("body").append("<div class='polizei' data-name='polizei' style='top: 500; left: 100'></div>")

    patrouilliere()
    gefasst()
}

function patrouilliere() {
    for (var x = 0; x < 3; x++) {
        var randomPolizei = randomNumberGen(0, $(".polizei").length - 1 )
        switch (randomNumberGen(0, 2)) {
            case 0:
                var zufallx = randomNumberGen(-200, 200)
                var zufally = randomNumberGen(-200, 200)
                
                var offset = $(".polizei").eq(randomPolizei).offset();
                var center_x = (offset.left) + 	($(".polizei").eq(randomPolizei).width()/2);
                var center_y = (offset.top) + ($(".polizei").eq(randomPolizei).height()/2);
    
                var radians = Math.atan2(zufallx - center_x, zufally - center_y);
                var degree = (radians * (180 / Math.PI) * -1) + 90; 
                $(".polizei").eq(randomPolizei).css('transform', 'rotate('+ degree +'deg)');
    
                $(".polizei").eq(randomPolizei).velocity({
                    left: "+=" + zufallx,
                    top: "+=" + zufally,
                }, {
                    duration: randomNumberGen(5000, 10000)
                })
            break
            case 1:
                var randomPlanet = randomNumberGen(0, $(".planet[data-name='Händler']").length - 1)
                var zufallx = parseInt($(".planet[data-name='Händler']").eq(randomPlanet).css("top"))
                var zufally = parseInt($(".planet[data-name='Händler']").eq(randomPlanet).css("left"))
                
                var offset = $(".polizei").eq(randomPolizei).offset();
                var center_x = (offset.left) + 	($(".polizei").eq(randomPolizei).width()/2);
                var center_y = (offset.top) + ($(".polizei").eq(randomPolizei).height()/2);
    
                var radians = Math.atan2(zufallx - center_x, zufally - center_y);
                var degree = (radians * (180 / Math.PI) * -1) + 90; 
                $(".polizei").eq(randomPolizei).css('transform', 'rotate('+ degree +'deg)');
    
                $(".polizei").eq(randomPolizei).velocity({
                    left: zufallx,
                    top: zufally,
                }, {
                    duration: 20000
                })
            break;
            case 2:
                var zufallx = parseInt($("#deinSchiff").css("left")) + randomNumberGen(-300, 300)
                var zufally = parseInt($("#deinSchiff").css("top")) + randomNumberGen(-300, 300)
                
                var offset = $(".polizei").eq(randomPolizei).offset();
                var center_x = (offset.left) + 	($(".polizei").eq(randomPolizei).width()/2);
                var center_y = (offset.top) + ($(".polizei").eq(randomPolizei).height()/2);
    
                var radians = Math.atan2(zufallx - center_x, zufally - center_y);
                var degree = (radians * (180 / Math.PI) * -1) + 90; 
                $(".polizei").eq(randomPolizei).css('transform', 'rotate('+ degree +'deg)');
    
                $(".polizei").eq(randomPolizei).velocity({
                    left: zufallx,
                    top: zufally,
                }, {
                    duration: 30000
                })
            break;
        }
    }
    setTimeout(patrouilliere, 3000)
}

function gefasst() {
    for (var x = 0; x < $(".polizei").length - 1; x++) {
    if (parseInt($("#deinSchiff").css("top")) >= parseInt($(".polizei").eq(x).css("top")) - 100 && parseInt($("#deinSchiff").css("top")) <= parseInt($(".polizei").eq(x).css("top")) + 100) {
        if (parseInt($("#deinSchiff").css("left")) >= parseInt($(".polizei").eq(x).css("left")) - 100 && parseInt($("#deinSchiff").css("left")) <= parseInt($(".polizei").eq(x).css("left")) + 100) {
            if ($("#deinSchiff").attr("data-ladung") != "" && $("#deinSchiff").attr("data-ladung") != undefined) {
                $("#deinSchiff").attr("data-ladung", "")
                geld = geld - 100
                nachricht("Du wurdest von einer Kontrolle erwischt und musstest 100T Strafe zahlen.")
                if (geld <= 0) {
                    nachricht("Du bist pleite.")
                }
            }
        }
    }
    }
    setTimeout(gefasst, 1000)
}

function playAudio(file) {
    var paudio = new Audio(file);
    paudio.volume = 0.9;
    paudio.play();
}

// events

$("html").on('click', function (myclick) {
    verbrauchswert = verbrauchswert + 1

    var center_x = parseInt($("#deinSchiff").css("left")) + ($("#deinSchiff").width()/2);
    var center_y = parseInt($("#deinSchiff").css("top")) + ($("#deinSchiff").height()/2);
    var mouse_x = myclick.pageX; var mouse_y = myclick.pageY;
    var radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
    var degree = (radians * (180 / Math.PI) * -1) + 90; 
    $("#deinSchiff").css('transform', 'rotate('+ degree +'deg)');

    if (raumschiff.reichweite > 0) {
        $("#deinSchiff").animate({
            left: myclick.pageX,
            top: myclick.pageY,
        }, {
            queue: false,
            duration: raumschiff.geschwindigkeit,
            complete: function () {
                //scrolleBild($("#deinSchiff"))
            }
        })
    
    if (randomNumberGen(0,5) == 0){        
        setTimeout( function () {
            playAudio("flug"+ randomNumberGen(1,3) +".ogg")
            }, 5000
        )
    }
    
    } else if (raumschiff.reichweite <= 0) {
        $("html").off('click')
        nachricht("Mh, vergessen zu tanken?")
    } else if (geld >= 20) {
        // play spruch adac
        geld = geld - 18
        raumschiff.reichweite = raumschiff.reichweite + 5
    }
})

$("html").on('click', 'div.planet', function (myplanet) {
    nachricht($(myplanet.currentTarget).attr("data-name"))
    if (parseInt($("#deinSchiff").css("top")) >= myplanet.pageY - 100 && parseInt($("#deinSchiff").css("top")) <= myplanet.pageY + 100) {
        if (parseInt($("#deinSchiff").css("left")) >= myplanet.pageX - 100 && parseInt($("#deinSchiff").css("left")) <= myplanet.pageX + 100) {
            if ($(myplanet.currentTarget).attr("data-name") == "Tanke") {
                // spruch
                if (geld - 50 >= 0) {
                    geld = geld - 50
                    raumschiff.reichweite = raumschiff.reichweite + 30
                    nachricht("Du hast für 50T getankt.")
                } else {
                    nachricht("Dir fehlen 50T zum Tanken.")
                }
            } else if ($(myplanet.currentTarget).attr("data-name") == "Händler") {
                // verkauf an händler
                for (var x = 0; x < waren.length; x++) {
                    if ($("#deinSchiff").attr("data-ladung") == waren[x].name) {
                        geld = geld + waren[x].verkauf
                        $("#deinSchiff").attr("data-ladung", "")
                        nachricht("Du hast " + waren[x].name + " für " + waren[x].verkauf + "T verkauft.")
                    }
                }
            } else {
                // waren aufnehmen
                if ($(myplanet.currentTarget).attr("data-waren") != "" && ($("#deinSchiff").attr("data-ladung") == "" || $("#deinSchiff").attr("data-ladung") == undefined)) {
                    if ($(myplanet.currentTarget).attr("data-waren") == "Booster") {
                        if (geld > 200) {
                            if (raumschiff.geschwindigkeit > 3000) {
                            raumschiff.geschwindigkeit = raumschiff.geschwindigkeit - 1000
                            geld = geld - 200
                            $(myplanet.currentTarget).attr("data-waren", "")
                            $(myplanet.currentTarget).find(".waren").remove()
                            nachricht("Du hast dein Schiff verbessert!")
                            } else {
                                nachricht("Du kannst dein Raumschiff leider nicht mehr verbessern...")
                            }
                        } else {
                            nachricht("Du hast nicht genügend Geld. Ein Booster kostet 200T und macht dich 1 Sekunde schneller!")
                        }
                    } else {
                        // beladen
                        if (geld >= 1) {
                            geld = geld - randomNumberGen(1,5)
                            $("#deinSchiff").attr("data-ladung", $(myplanet.currentTarget).attr("data-waren"))
                            $(myplanet.currentTarget).attr("data-waren", "")
                            $(myplanet.currentTarget).find(".waren").remove()
                            nachricht("Du hast " + $("#deinSchiff").attr("data-ladung") + " eingeladen.")
                            for (var x = 0; x < waren.length; x++) {
                                if ($("#deinSchiff").attr("data-ladung") == waren[x].name) {
                                    playAudio(waren[x].sound)
                                }
                            }
                        } else {
                            nachricht("Du hast kein Geld, um Waren zu kaufen.")
                        }
                    }
                } else if ($("#deinSchiff").attr("data-ladung") != "" || $("#deinSchiff").attr("data-ladung") != undefined) (
                    nachricht("Du kannst keine Ladung mehr aufnehmen. Flieg zu einem Händler um sie zu verkaufen.")
                )
            }
        }
    }
})

init()
