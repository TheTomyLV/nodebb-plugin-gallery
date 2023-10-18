<a href="/gallery">Galerija</a>
{{{ each folder }}}
<div>
    <a href="/gallery/{folder.url}" class="title text-break fs-4 fw-semibold m-0 tracking-tight w-100 text-reset">{folder.name}</a>
    <br>
    {{{ each folder.images }}}
        <img src="{@value}" alt="" width="100">
    {{{ end }}}
</div>


{{{ end }}}